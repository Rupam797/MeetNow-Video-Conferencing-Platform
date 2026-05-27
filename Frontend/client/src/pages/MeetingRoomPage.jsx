import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import VideoTile from '../components/VideoTile';
import ControlBar from '../components/ControlBar';
import ChatPanel from '../components/ChatPanel';
import ParticipantPanel from '../components/ParticipantPanel';
import { toast } from 'react-toastify';
import { Clipboard, Video as VideoIcon } from 'lucide-react';
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

  // Read initial device states from lobby redirect
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

  // Participant name registry: uid -> name
  const [participantNames, setParticipantNames] = useState({});
  const pollIntervalRef = useRef(null);

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
    // Fetch immediately
    fetchParticipantNames();

    // Then poll every 5 seconds
    pollIntervalRef.current = setInterval(fetchParticipantNames, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchParticipantNames]);

  // Helper to get display name for a remote user
  const getRemoteUserName = (remoteUid) => {
    return participantNames[String(remoteUid)] || `Participant ${remoteUid}`;
  };

  // 1. Join the Agora RTC Channel
  useJoin(
    {
      appid: appId,
      channel: roomId,
      token: token,
      uid: uid,
    },
    true
  );

  // 2. Initialize local mic and camera tracks
  // Pass the toggle state directly to the hooks — the hooks handle
  // creating the track when true and releasing it when false.
  // Do NOT use setEnabled() separately, as it conflicts with hook internals.
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micActive);
  const { localCameraTrack } = useLocalCameraTrack(cameraActive);

  // 3. Publish local video/audio tracks (including screen track when active)
  usePublish([localMicrophoneTrack, localCameraTrack, screenTrack]);

  // 4. Retrieve remote users in the channel and subscribe to their tracks
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  useRemoteVideoTracks(remoteUsers);

  // Re-fetch participant names when remote users list changes (new user joined/left)
  useEffect(() => {
    fetchParticipantNames();
  }, [remoteUsers.length, fetchParticipantNames]);

  // 5. Play remote users' audio automatically
  useEffect(() => {
    audioTracks.forEach((track) => {
      if (track && !track.isPlaying) {
        track.play();
      }
    });
  }, [audioTracks]);

  // 6. Screen Share toggle — usePublish handles publication automatically
  const handleToggleScreenShare = async () => {
    if (screenShareActive) {
      // Stop screen share — close the track and clear state
      // usePublish will automatically unpublish when screenTrack becomes null
      const oldTrack = screenTrack;
      setScreenTrack(null);
      setScreenShareActive(false);
      if (oldTrack) {
        oldTrack.close();
      }
    } else {
      try {
        const track = await AgoraRTC.createScreenVideoTrack();
        // Setting state triggers re-render → usePublish picks up the new track
        setScreenTrack(track);
        setScreenShareActive(true);

        // Listen for screen share stop from browser's native "Stop sharing" button
        track.on('track-ended', () => {
          setScreenTrack(null);
          setScreenShareActive(false);
          track.close();
        });

      } catch (err) {
        console.error('Failed to share screen:', err);
        toast.error('Screen sharing was cancelled or failed.');
        setScreenShareActive(false);
      }
    }
  };

  const handleLeave = async () => {
    // Unregister participant name
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

    // Clean up screen share if active
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
    toast.success('Room link copied to clipboard!');
  };

  // Determine grid layout CSS class
  const totalTiles = remoteUsers.length + 1;
  let gridClass = 'grid-1';
  if (totalTiles === 2) gridClass = 'grid-2';
  else if (totalTiles === 3) gridClass = 'grid-3';
  else if (totalTiles === 4) gridClass = 'grid-4';
  else if (totalTiles > 4) gridClass = 'grid-many';

  return (
    <div className="meeting-page">
      {/* Topbar */}
      <header className="meeting-topbar">
        <div className="meeting-topbar-left">
          <div className="meeting-topbar-logo">
            <VideoIcon size={16} style={{ color: 'var(--accent)' }} />
            <span>MeetNow</span>
          </div>
          <div className="meeting-topbar-code">
            <span>{roomId}</span>
            <button 
              onClick={copyRoomLink} 
              className="btn btn-ghost btn-icon" 
              style={{ width: '24px', height: '24px' }}
              title="Copy Invite Link"
            >
              <Clipboard size={12} />
            </button>
          </div>
        </div>
        <div className="meeting-topbar-right">
          <span>Connected as {user?.name || 'Guest'}</span>
        </div>
      </header>

      {/* Main Grid Area */}
      <div className="meeting-body">
        <div className="meeting-video-area">
          <div className={`video-grid ${gridClass}`}>
            {/* Local participant video tile */}
            <VideoTile
              track={screenShareActive ? screenTrack : localCameraTrack}
              isLocal={true}
              name={`${user?.name || 'You'}${screenShareActive ? ' (Screen)' : ''}`}
              videoActive={screenShareActive ? true : cameraActive}
              audioActive={micActive}
            />

            {/* Remote participants video tiles */}
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

      {/* Controls Footer */}
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
      />
    </div>
  );
};

export default MeetingRoomPage;
