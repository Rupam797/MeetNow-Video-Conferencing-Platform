import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Mic, MicOff, Video, VideoOff, Clipboard, ArrowRight, User, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const LobbyPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [isValidating, setIsValidating] = useState(true);
  const [previewStream, setPreviewStream] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [selectedMicId, setSelectedMicId] = useState('');

  // Admission control state
  const [createdBy, setCreatedBy] = useState(null);
  const [waitingForAdmission, setWaitingForAdmission] = useState(false);
  const [admissionRequestId, setAdmissionRequestId] = useState(null);
  const [admissionDenied, setAdmissionDenied] = useState(false);
  const admissionPollRef = useRef(null);
  
  const videoRef = useRef(null);

  useEffect(() => {
    const validateRoom = async () => {
      try {
        const response = await api.get(`/api/meetings/validate/${roomId}`);
        setCreatedBy(response.data.createdBy || null);
        setIsValidating(false);
      } catch (error) {
        console.error('Room validation failed:', error);
        toast.error('This meeting room does not exist.');
        navigate('/dashboard');
      }
    };
    validateRoom();
  }, [roomId, navigate]);

  const getDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
      const audioDevices = deviceList.filter(device => device.kind === 'audioinput');
      
      setCameras(videoDevices);
      setMicrophones(audioDevices);

      if (videoDevices.length > 0) {
        setSelectedCameraId(prev => prev || videoDevices[0].deviceId);
      }
      if (audioDevices.length > 0) {
        setSelectedMicId(prev => prev || audioDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error listing devices:', err);
    }
  };

  useEffect(() => {
    if (isValidating) return;
    let activeStream = null;

    const enableStream = async () => {
      try {
        const constraints = {
          video: cameraActive ? { 
            deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
            width: 640, 
            height: 480, 
            facingMode: 'user' 
          } : false,
          audio: micActive ? (selectedMicId ? { deviceId: { exact: selectedMicId } } : true) : false
        };
        if (constraints.video || constraints.audio) {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          activeStream = stream;
          setPreviewStream(stream);
          await getDevices();
        } else {
          setPreviewStream(null);
        }
      } catch (err) {
        console.warn('Failed to access media devices in preview:', err);
        toast.warning('Could not access microphone or camera. You can still join.');
        setCameraActive(false);
        setMicActive(false);
      }
    };
    enableStream();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive, micActive, selectedCameraId, selectedMicId, isValidating]);

  // Handle attaching stream to video element when it mounts
  useEffect(() => {
    if (videoRef.current && previewStream && cameraActive) {
      videoRef.current.srcObject = previewStream;
    }
  }, [previewStream, cameraActive]);

  const toggleMic = () => setMicActive(prev => !prev);
  const toggleCamera = () => setCameraActive(prev => !prev);

  const handleFlipCamera = () => {
    if (cameras.length <= 1) {
      toast.info('No other camera detected to switch to.');
      return;
    }
    const currentIndex = cameras.findIndex(c => c.deviceId === selectedCameraId);
    const nextIndex = (currentIndex === -1) ? 0 : (currentIndex + 1) % cameras.length;
    setSelectedCameraId(cameras[nextIndex].deviceId);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const navigateToRoom = () => {
    navigate(`/room/${roomId}`, { 
      state: { 
        initialMic: micActive, 
        initialCamera: cameraActive,
        selectedCameraId: cameraActive ? selectedCameraId : null,
        selectedMicId: micActive ? selectedMicId : null,
        createdBy: createdBy
      } 
    });
  };

  const handleJoin = async () => {
    // Host bypasses the admission queue
    const isHost = user?.email && createdBy && user.email === createdBy;
    if (isHost) {
      navigateToRoom();
      return;
    }

    // Non-host: submit an admission request
    try {
      const response = await api.post('/api/meetings/admission/request', {
        channelName: roomId,
        name: user?.name || 'Guest',
        email: user?.email || '',
      });
      setAdmissionRequestId(response.data.requestId);
      setWaitingForAdmission(true);
      setAdmissionDenied(false);
    } catch (err) {
      console.error('Failed to submit admission request:', err);
      toast.error('Failed to request admission. Please try again.');
    }
  };

  const cancelAdmission = () => {
    if (admissionPollRef.current) {
      clearInterval(admissionPollRef.current);
      admissionPollRef.current = null;
    }
    setWaitingForAdmission(false);
    setAdmissionRequestId(null);
    setAdmissionDenied(false);
  };

  // Poll for admission status when waiting
  useEffect(() => {
    if (!waitingForAdmission || !admissionRequestId) return;

    const pollStatus = async () => {
      try {
        const response = await api.get(`/api/meetings/admission/status/${admissionRequestId}`);
        const status = response.data.status;
        if (status === 'ACCEPTED') {
          clearInterval(admissionPollRef.current);
          admissionPollRef.current = null;
          setWaitingForAdmission(false);
          toast.success('You have been admitted! Joining the meeting...');
          navigateToRoom();
        } else if (status === 'DENIED') {
          clearInterval(admissionPollRef.current);
          admissionPollRef.current = null;
          setWaitingForAdmission(false);
          setAdmissionDenied(true);
          toast.error('The host has denied your request to join.');
        }
      } catch (err) {
        console.error('Error polling admission status:', err);
      }
    };

    admissionPollRef.current = setInterval(pollStatus, 2000);

    return () => {
      if (admissionPollRef.current) {
        clearInterval(admissionPollRef.current);
      }
    };
  }, [waitingForAdmission, admissionRequestId]);

  const copyRoomLink = () => {
    const link = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(link);
    toast.success('Room link copied!');
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-offwhite dark:bg-primary text-secondary dark:text-offwhite/70 transition-colors duration-300">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-brand dark:border-border-primary dark:border-t-brand rounded-full animate-spin" />
        <p className="font-[Outfit]">Validating room details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite dark:bg-primary text-primary dark:text-white transition-colors duration-300">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center p-6 pt-20">
        <div className="max-w-[1120px] mx-auto px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 max-w-[920px] w-full mx-auto">
            {/* Left Column — Preview */}
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-gray-200 dark:border-border-primary/60 bg-gray-100 dark:bg-tertiary shadow-lg group">
              {cameraActive && previewStream?.getVideoTracks().length > 0 ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-secondary/40 dark:text-offwhite/30">
                  <div className="w-[80px] h-[80px] rounded-full bg-white dark:bg-surface flex items-center justify-center border border-gray-200 dark:border-border-primary/50 shadow-inner">
                    {user?.name ? (
                      <span className="text-[32px] font-bold font-[Outfit] text-primary dark:text-white">
                        {getInitials(user.name)}
                      </span>
                    ) : (
                      <User size={40} />
                    )}
                  </div>
                  <span className="font-[Outfit] text-sm text-secondary dark:text-offwhite/50">Camera is turned off</span>
                </div>
              )}

              {/* Toggle Buttons Overlaid */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-2.5 rounded-full bg-black/60 backdrop-blur-md z-10">
                <button 
                  onClick={toggleMic} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 border ${
                    micActive 
                      ? 'border-white/20 text-white bg-transparent hover:bg-white/10' 
                      : 'border-transparent bg-coral text-white shadow-md shadow-coral/20'
                  }`}
                  title={micActive ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {micActive ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button 
                  onClick={toggleCamera} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 border ${
                    cameraActive 
                      ? 'border-white/20 text-white bg-transparent hover:bg-white/10' 
                      : 'border-transparent bg-coral text-white shadow-md shadow-coral/20'
                  }`}
                  title={cameraActive ? 'Turn Camera Off' : 'Turn Camera On'}
                >
                  {cameraActive ? <Video size={16} /> : <VideoOff size={16} />}
                </button>
                {cameraActive && cameras.length > 1 && (
                  <button 
                    onClick={handleFlipCamera} 
                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 border border-white/20 text-white bg-transparent hover:bg-white/10 hover:border-brand/40"
                    title="Switch Camera"
                  >
                    <RefreshCw size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column — Info & Join */}
            <div className="flex flex-col justify-center gap-6">
              {waitingForAdmission ? (
                <div className="flex flex-col gap-6 py-8 px-6 bg-white dark:bg-tertiary border border-gray-200 dark:border-border-primary/60 rounded-3xl shadow-xl animate-[fade-in_0.3s_ease-out]">
                  <div className="flex flex-col items-center justify-center text-center gap-4">
                    {/* Spinner */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-brand/20 rounded-full animate-ping" />
                      <div className="w-12 h-12 border-4 border-transparent border-t-brand border-r-brand rounded-full animate-spin" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-bold font-[Outfit] text-primary dark:text-white">Asking to join...</h3>
                      <p className="text-xs text-secondary/60 dark:text-offwhite/50 font-[Outfit]">
                        The meeting host has been notified. You'll join automatically once they accept.
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={cancelAdmission} 
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-border-primary hover:border-coral dark:hover:border-coral hover:bg-coral/5 hover:text-coral dark:hover:text-coral cursor-pointer transition-all duration-150 text-primary dark:text-white bg-transparent font-[Outfit]"
                  >
                    <span>Cancel Request</span>
                  </button>
                </div>
              ) : admissionDenied ? (
                <div className="flex flex-col gap-6 py-8 px-6 bg-white dark:bg-tertiary border border-gray-200 dark:border-border-primary/60 rounded-3xl shadow-xl animate-[fade-in_0.3s_ease-out]">
                  <div className="flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center text-coral">
                      <X size={32} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-bold font-[Outfit] text-primary dark:text-white">Request Denied</h3>
                      <p className="text-xs text-secondary/60 dark:text-offwhite/50 font-[Outfit]">
                        The host did not accept your request to join this meeting.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setAdmissionDenied(false)} 
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl bg-primary text-brand hover:bg-primary/95 dark:bg-brand dark:text-secondary dark:hover:bg-brand-hover cursor-pointer transition-all duration-150 active:scale-[0.98] font-[Outfit] shadow-md shadow-brand/10"
                    >
                      <span>Ask Again</span>
                    </button>
                    <button 
                      onClick={() => navigate('/dashboard')} 
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-border-primary hover:border-primary dark:hover:border-white hover:bg-gray-50 dark:hover:bg-surface-hover cursor-pointer transition-all duration-150 text-primary dark:text-white bg-transparent font-[Outfit]"
                    >
                      <span>Back to Dashboard</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold font-[Outfit] text-primary dark:text-white">Ready to join?</h2>
                    <p className="mt-2 text-sm text-secondary dark:text-offwhite/60 font-light font-[Outfit] leading-relaxed">
                      Configure your microphone and camera settings, check your network signals, and connect securely.
                    </p>
                  </div>

                  {/* Device Settings Dropdowns */}
                  <div className="flex flex-col gap-3">
                    <span className="font-bold text-xs uppercase tracking-wider font-[Outfit] text-secondary/50 dark:text-offwhite/40">Device Settings</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Camera Select */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-secondary/60 dark:text-offwhite/50 font-semibold font-[Outfit]">Camera Device</label>
                        <select
                          value={selectedCameraId}
                          onChange={(e) => setSelectedCameraId(e.target.value)}
                          disabled={!cameraActive}
                          className="w-full px-3 py-2 bg-white dark:bg-input border border-gray-200 dark:border-border-primary/65 rounded-xl text-xs text-primary dark:text-white font-[Outfit] outline-none focus:border-brand transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                          {cameras.length > 0 ? (
                            cameras.map((camera) => (
                              <option key={camera.deviceId} value={camera.deviceId} className="dark:bg-secondary">
                                {camera.label || `Camera ${camera.deviceId.substring(0, 5)}`}
                              </option>
                            ))
                          ) : (
                            <option value="" className="dark:bg-secondary">No camera detected</option>
                          )}
                        </select>
                      </div>

                      {/* Mic Select */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-secondary/60 dark:text-offwhite/50 font-semibold font-[Outfit]">Audio Input Device</label>
                        <select
                          value={selectedMicId}
                          onChange={(e) => setSelectedMicId(e.target.value)}
                          disabled={!micActive}
                          className="w-full px-3 py-2 bg-white dark:bg-input border border-gray-200 dark:border-border-primary/65 rounded-xl text-xs text-primary dark:text-white font-[Outfit] outline-none focus:border-brand transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                          {microphones.length > 0 ? (
                            microphones.map((mic) => (
                              <option key={mic.deviceId} value={mic.deviceId} className="dark:bg-secondary">
                                {mic.label || `Microphone ${mic.deviceId.substring(0, 5)}`}
                              </option>
                            ))
                          ) : (
                            <option value="" className="dark:bg-secondary">No microphone detected</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-border-primary/65 text-sm bg-white dark:bg-input text-secondary dark:text-offwhite">
                    <span className="font-bold text-xs uppercase tracking-wider font-[Outfit] text-secondary/50 dark:text-offwhite/40">Room Code</span>
                    <code className="flex-1 font-mono text-sm text-brand font-bold text-center">{roomId}</code>
                    <button 
                      onClick={copyRoomLink} 
                      className="p-1.5 rounded-full cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-surface-hover text-secondary dark:text-offwhite" 
                      title="Copy share link"
                    >
                      <Clipboard size={14} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleJoin} 
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl bg-primary text-brand hover:bg-primary/95 dark:bg-brand dark:text-secondary dark:hover:bg-brand-hover cursor-pointer transition-all duration-150 active:scale-[0.98] font-[Outfit] shadow-md shadow-brand/10"
                    >
                      <span>Enter Room Now</span>
                      <ArrowRight size={16} />
                    </button>
                    <button 
                      onClick={() => navigate('/dashboard')} 
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-border-primary hover:border-primary dark:hover:border-white hover:bg-gray-50 dark:hover:bg-surface-hover cursor-pointer transition-all duration-150 text-primary dark:text-white bg-transparent font-[Outfit]"
                    >
                      <span>Back to Dashboard</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
