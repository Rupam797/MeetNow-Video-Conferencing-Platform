import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Mic, MicOff, Video, VideoOff, Clipboard, ArrowRight, User } from 'lucide-react';
import { toast } from 'react-toastify';

const LobbyPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [isValidating, setIsValidating] = useState(true);
  const [previewStream, setPreviewStream] = useState(null);
  
  const videoRef = useRef(null);

  // 1. Validate that the meeting room exists
  useEffect(() => {
    const validateRoom = async () => {
      try {
        await api.get(`/api/meetings/validate/${roomId}`);
        setIsValidating(false);
      } catch (error) {
        console.error('Room validation failed:', error);
        toast.error('This meeting room does not exist.');
        navigate('/dashboard');
      }
    };

    validateRoom();
  }, [roomId, navigate]);

  // 2. Control webcam preview stream - Get the stream once on validation success
  useEffect(() => {
    if (isValidating) return;

    let activeStream = null;
    let isCancelled = false;

    const initStream = async () => {
      try {
        // Try requesting both video and audio first
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: true
        });

        if (isCancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        activeStream = stream;
        
        // Sync track enabled states with current toggle states
        stream.getVideoTracks().forEach(track => {
          track.enabled = cameraActive;
        });
        stream.getAudioTracks().forEach(track => {
          track.enabled = micActive;
        });

        setPreviewStream(stream);
      } catch (err) {
        console.warn('Failed to get both video and audio, trying video only:', err);
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: 'user' }
          });
          if (isCancelled) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          activeStream = stream;
          stream.getVideoTracks().forEach(track => {
            track.enabled = cameraActive;
          });
          setPreviewStream(stream);
          setMicActive(false);
        } catch (err2) {
          console.warn('Failed to get video, trying audio only:', err2);
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true
            });
            if (isCancelled) {
              stream.getTracks().forEach(track => track.stop());
              return;
            }
            activeStream = stream;
            stream.getAudioTracks().forEach(track => {
              track.enabled = micActive;
            });
            setPreviewStream(stream);
            setCameraActive(false);
          } catch (err3) {
            console.warn('No media devices accessible:', err3);
            toast.warning('Could not access microphone or camera. You can still join.');
            setCameraActive(false);
            setMicActive(false);
          }
        }
      }
    };

    initStream();

    return () => {
      isCancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isValidating]);

  // 3. Reactively control video track states when cameraActive toggle changes
  useEffect(() => {
    if (previewStream) {
      previewStream.getVideoTracks().forEach(track => {
        track.enabled = cameraActive;
      });
    }
  }, [previewStream, cameraActive]);

  // 4. Reactively control audio track states when micActive toggle changes
  useEffect(() => {
    if (previewStream) {
      previewStream.getAudioTracks().forEach(track => {
        track.enabled = micActive;
      });
    }
  }, [previewStream, micActive]);

  // 5. Safely assign the srcObject to video element after rendering
  useEffect(() => {
    if (videoRef.current && previewStream && cameraActive) {
      if (videoRef.current.srcObject !== previewStream) {
        videoRef.current.srcObject = previewStream;
      }
    }
  }, [previewStream, cameraActive]);

  const toggleMic = () => setMicActive(prev => !prev);
  const toggleCamera = () => setCameraActive(prev => !prev);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleJoin = () => {
    // Navigate to the meeting room page and pass device states in history state
    navigate(`/room/${roomId}`, { 
      state: { 
        initialMic: micActive, 
        initialCamera: cameraActive 
      } 
    });
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(link);
    toast.success('Room link copied!');
  };

  if (isValidating) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-lg"></div>
        <p>Validating room details...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="lobby-page page-wrapper">
        <div className="container">
          <div className="lobby-container">
            {/* Left Column — Preview */}
            <div className="lobby-preview">
              {cameraActive && previewStream?.getVideoTracks().length > 0 ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                />
              ) : (
                <div className="lobby-preview-off">
                  <div className="lobby-preview-avatar">
                    {user?.name ? (
                      <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {getInitials(user.name)}
                      </span>
                    ) : (
                      <User size={48} />
                    )}
                  </div>
                  <span>Camera is turned off</span>
                </div>
              )}

              {/* Toggle Buttons Overlaid */}
              <div className="lobby-controls-bar">
                <button 
                  onClick={toggleMic} 
                  className={`btn btn-icon ${micActive ? 'btn-secondary' : 'btn-danger'}`}
                  title={micActive ? 'Mute Mic' : 'Unmute Mic'}
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                >
                  {micActive ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button 
                  onClick={toggleCamera} 
                  className={`btn btn-icon ${cameraActive ? 'btn-secondary' : 'btn-danger'}`}
                  title={cameraActive ? 'Turn Camera Off' : 'Turn Camera On'}
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                >
                  {cameraActive ? <Video size={16} /> : <VideoOff size={16} />}
                </button>
              </div>
            </div>

            {/* Right Column — Info & Join */}
            <div className="lobby-info">
              <div>
                <h2 className="lobby-title">Ready to join?</h2>
                <p className="text-muted" style={{ marginTop: 'var(--space-2)' }}>
                  Set up your camera and microphone audio before entering the meeting.
                </p>
              </div>

              <div className="room-id-display">
                <span style={{ marginRight: '8px' }}>Room Code:</span>
                <code>{roomId}</code>
                <button 
                  onClick={copyRoomLink} 
                  className="btn btn-ghost btn-sm btn-icon"
                  title="Copy share link"
                >
                  <Clipboard size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleJoin} 
                  className="btn btn-primary btn-lg w-full"
                >
                  <span>Join Meeting</span>
                  <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn btn-secondary w-full"
                >
                  <span>Back to Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
