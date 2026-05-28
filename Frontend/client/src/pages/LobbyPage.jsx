import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Mic, MicOff, Video, VideoOff, Copy, Check, ArrowRight, User } from 'lucide-react';
import { toast } from 'react-toastify';

const LobbyPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [isValidating, setIsValidating] = useState(true);
  const [previewStream, setPreviewStream] = useState(null);
  const [copied, setCopied] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');
  
  const videoRef = useRef(null);

  // Validate that the meeting room exists
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

  // Control webcam preview stream
  useEffect(() => {
    if (isValidating) return;

    let activeStream = null;

    const enableStream = async () => {
      try {
        const constraints = {
          video: cameraActive ? { width: 640, height: 480, facingMode: 'user' } : false,
          audio: micActive
        };

        if (constraints.video || constraints.audio) {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          activeStream = stream;
          setPreviewStream(stream);

          if (videoRef.current && cameraActive) {
            videoRef.current.srcObject = stream;
          }
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
  }, [cameraActive, micActive, isValidating]);

  const toggleMic = () => setMicActive(prev => !prev);
  const toggleCamera = () => setCameraActive(prev => !prev);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleJoin = () => {
    navigate(`/room/${roomId}`, { 
      state: { 
        initialMic: micActive, 
        initialCamera: cameraActive 
      } 
    });
  };

  const copyMeetingId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    toast.success('Meeting ID copied!');
    setTimeout(() => setCopied(false), 1500);
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

      <div className="lobby-page">
        {/* Animated Background Orbs */}
        <div className="lobby-orbs">
          <div className="orb orb-indigo"></div>
          <div className="orb orb-cyan"></div>
        </div>

        <div className="lobby-container">
          {/* Left Column — Camera Preview */}
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
                  {user?.name ? getInitials(user.name) : <User size={32} />}
                </div>
                <span>Camera Off</span>
              </div>
            )}

            {/* Device Toggle Buttons */}
            <div className="lobby-controls-bar">
              <button 
                onClick={toggleMic} 
                className={`device-toggle ${micActive ? 'active' : 'inactive'}`}
                title={micActive ? 'Mute Mic' : 'Unmute Mic'}
              >
                {micActive ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button 
                onClick={toggleCamera} 
                className={`device-toggle ${cameraActive ? 'active' : 'inactive'}`}
                title={cameraActive ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {cameraActive ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
            </div>
          </div>

          {/* Right Column — Join Info */}
          <div className="lobby-info">
            <div>
              <h2 className="lobby-title">Ready to join?</h2>
              <p className="lobby-subtitle">
                Set up your camera and microphone before entering the meeting.
              </p>
            </div>

            <div className="input-group">
              <label>Your display name</label>
              <input
                type="text"
                className="input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="meeting-id-row">
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Meeting ID</span>
              <code>{roomId}</code>
              <button 
                onClick={copyMeetingId}
                className={copied ? 'copied' : ''}
                title="Copy Meeting ID"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <div className="lobby-actions">
              <button 
                onClick={handleJoin} 
                className="btn btn-primary btn-lg w-full"
              >
                <span>Join Now</span>
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
  );
};

export default LobbyPage;
