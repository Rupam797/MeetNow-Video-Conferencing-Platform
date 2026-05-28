import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import VideoTile from '../components/VideoTile';
import ControlBar from '../components/ControlBar';
import ChatPanel from '../components/ChatPanel';
import ParticipantPanel from '../components/ParticipantPanel';
import { toast } from 'react-toastify';
import { Copy, Lock, Users } from 'lucide-react';
import AgoraRTC, {
  AgoraRTCProvider,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  useRemoteAudioTracks,
  useRemoteVideoTracks,
} from 'agora-rtc-react';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const MeetingRoomPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  const { initialMic = true, initialCamera = true } = location.state || {};

  useEffect(() => {
    const fetchToken = async () => {
      const randomUid = Math.floor(Math.random() * 100000) + 1;
      try {
        const response = await api.get('/api/meetings/token', {
          params: {
            channelName: roomId,
            uid: randomUid,
          },
        });
        
        setToken(response.data.token);
        setUid(randomUid);
        setLoading(false);
      } catch (err) {
        console.error('Failed to get Agora token:', err);
        toast.error('Failed to authenticate meeting session. Redirecting...');
        navigate('/dashboard');
      }
    };

    fetchToken();
  }, [roomId, navigate]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-lg"></div>
        <p>Connecting to secure meeting channel...</p>
      </div>
    );
  }

  return (
    <AgoraRTCProvider client={client}>
      <MeetingRoomInner 
        appId={import.meta.env.VITE_AGORA_APP_ID}
        roomId={roomId}
        token={token}
        uid={uid}
        user={user}
        initialMic={initialMic}
        initialCamera={initialCamera}
        navigate={navigate}
      />
    </AgoraRTCProvider>
  );
};

// Inner component to safely consume Agora RTC context
const MeetingRoomInner = ({ 
  appId, 
  roomId, 
  token, 
  uid, 
  user, 
  initialMic, 
  initialCamera, 
  navigate 
}) => {
  const [micActive, setMicActive] = useState(initialMic);
  const [cameraActive, setCameraActive] = useState(initialCamera);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [screenTrack, setScreenTrack] = useState(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);

  // Floating emojis
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  // Participant name registry
  const [participantNames, setParticipantNames] = useState({});
  const pollIntervalRef = useRef(null);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Register local user's name when joining
  useEffect(() => {
    const registerParticipant = async () => {
      try {
        await api.post('/api/meetings/participants/register', {
          channelName: roomId,
          uid: String(uid),
          name: user?.name || 'Guest',
        });
      } catch (err) {
        console.error('Failed to register participant name:', err);
      }
    };

    registerParticipant();
  }, [roomId, uid, user]);

  // Fetch participant names periodically
  const fetchParticipantNames = useCallback(async () => {
    try {
      const response = await api.get(`/api/meetings/participants/${roomId}`);
      setParticipantNames(response.data);
    } catch (err) {
      console.error('Failed to fetch participant names:', err);
    }
  }, [roomId]);

  useEffect(() => {
    fetchParticipantNames();
    pollIntervalRef.current = setInterval(fetchParticipantNames, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchParticipantNames]);

  const getRemoteUserName = (remoteUid) => {
    return participantNames[String(remoteUid)] || `Participant ${remoteUid}`;
  };

  // Join Agora RTC Channel
  useJoin(
    {
      appid: appId,
      channel: roomId,
      token: token,
      uid: uid,
    },
    true
  );

  // Initialize local tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micActive);
  const { localCameraTrack } = useLocalCameraTrack(cameraActive);

  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Get remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  useRemoteVideoTracks(remoteUsers);

  // Re-fetch names when users change
  useEffect(() => {
    fetchParticipantNames();
  }, [remoteUsers.length, fetchParticipantNames]);

  // Play remote audio
  useEffect(() => {
    audioTracks.forEach((track) => {
      if (track && !track.isPlaying) {
        track.play();
      }
    });
  }, [audioTracks]);

  // Handle device toggles
  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(micActive);
    }
  }, [micActive, localMicrophoneTrack]);

  useEffect(() => {
    if (localCameraTrack && !screenShareActive) {
      localCameraTrack.setEnabled(cameraActive);
    }
  }, [cameraActive, localCameraTrack, screenShareActive]);

  // Screen share toggle
  const handleToggleScreenShare = async () => {
    if (screenShareActive) {
      if (screenTrack) {
        await client.unpublish(screenTrack);
        screenTrack.close();
        setScreenTrack(null);
      }
      setScreenShareActive(false);
      
      if (localCameraTrack && cameraActive) {
        await client.publish(localCameraTrack);
        localCameraTrack.setEnabled(true);
      }
    } else {
      try {
        const track = await AgoraRTC.createScreenVideoTrack();
        setScreenTrack(track);
        setScreenShareActive(true);

        if (localCameraTrack) {
          await client.unpublish(localCameraTrack);
        }

        await client.publish(track);

        track.on('track-ended', async () => {
          await client.unpublish(track);
          track.close();
          setScreenTrack(null);
          setScreenShareActive(false);
          
          if (localCameraTrack && cameraActive) {
            await client.publish(localCameraTrack);
            localCameraTrack.setEnabled(true);
          }
        });

      } catch (err) {
        console.error('Failed to share screen:', err);
        toast.error('Screen sharing was cancelled or failed.');
        setScreenShareActive(false);
      }
    }
  };

  // Emoji reaction handler
  const handleSendEmoji = (emoji) => {
    const id = Date.now();
    const x = Math.random() * 60 + 20; // Random position 20-80% from left
    
    setFloatingEmojis(prev => [...prev, { id, emoji, x }]);

    // Remove after animation completes
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 1200);
  };

  const handleLeave = async () => {
    try {
      await api.post('/api/meetings/participants/unregister', {
        channelName: roomId,
        uid: String(uid),
      });
    } catch (err) {
      console.error('Failed to unregister participant:', err);
    }

    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    if (screenTrack) {
      screenTrack.close();
    }
    await client.leave();
    toast.info('You left the meeting.');
    navigate('/dashboard');
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(link);
    toast.success('Room link copied!');
  };

  // Grid layout class
  const totalTiles = remoteUsers.length + 1;
  let gridClass = 'grid-1';
  if (totalTiles === 2) gridClass = 'grid-2';
  else if (totalTiles === 3) gridClass = 'grid-3';
  else if (totalTiles === 4) gridClass = 'grid-4';
  else if (totalTiles > 4) gridClass = 'grid-many';

  return (
    <div className="meeting-page">
      {/* Top Bar */}
      <header className="meeting-topbar">
        <div className="meeting-topbar-left">
          <span className="meeting-title">Team Standup</span>
          <span className="meeting-timer">{formatTime(elapsedTime)}</span>
          <button 
            onClick={copyRoomLink}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 8px' }}
            title="Copy room link"
          >
            <Copy size={14} />
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>{roomId.slice(0, 8)}...</span>
          </button>
        </div>
        <div className="meeting-topbar-right">
          <div className="encrypted-badge">
            <Lock size={12} />
            <span>Encrypted</span>
          </div>
          <div className="participant-count">
            <Users size={14} />
            <span>{remoteUsers.length + 1}</span>
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <div className="meeting-body">
        <div className="meeting-video-area">
          <div className={`video-grid ${gridClass}`}>
            {/* Local participant tile */}
            <VideoTile
              track={screenShareActive ? screenTrack : localCameraTrack}
              isLocal={true}
              name={`${user?.name || 'You'}${screenShareActive ? ' (Screen)' : ''}`}
              videoActive={screenShareActive ? true : cameraActive}
              audioActive={micActive}
            />

            {/* Remote participant tiles */}
            {remoteUsers.map((remoteUser) => (
              <VideoTile
                key={remoteUser.uid}
                user={remoteUser}
                isLocal={false}
                name={getRemoteUserName(remoteUser.uid)}
                videoActive={remoteUser.hasVideo}
                audioActive={remoteUser.hasAudio}
              />
            ))}
          </div>
        </div>

        {/* Side Panels */}
        {chatOpen && (
          <ChatPanel onClose={() => setChatOpen(false)} />
        )}
        
        {participantsOpen && (
          <ParticipantPanel 
            remoteUsers={remoteUsers} 
            participantNames={participantNames}
            onClose={() => setParticipantsOpen(false)} 
          />
        )}
      </div>

      {/* Control Bar */}
      <ControlBar
        micActive={micActive}
        cameraActive={cameraActive}
        screenShareActive={screenShareActive}
        chatOpen={chatOpen}
        participantsOpen={participantsOpen}
        onToggleMic={() => setMicActive(p => !p)}
        onToggleCamera={() => setCameraActive(p => !p)}
        onToggleScreenShare={handleToggleScreenShare}
        onToggleChat={() => {
          setChatOpen(p => !p);
          setParticipantsOpen(false);
        }}
        onToggleParticipants={() => {
          setParticipantsOpen(p => !p);
          setChatOpen(false);
        }}
        onLeave={handleLeave}
        onSendEmoji={handleSendEmoji}
      />

      {/* Floating Emojis */}
      {floatingEmojis.map(({ id, emoji, x }) => (
        <div
          key={id}
          className="floating-emoji"
          style={{ left: `${x}%`, bottom: '100px' }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
};

export default MeetingRoomPage;
