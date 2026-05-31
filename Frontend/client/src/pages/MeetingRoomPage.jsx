import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import VideoTile from '../components/VideoTile';
import ControlBar from '../components/ControlBar';
import ChatPanel from '../components/ChatPanel';
import ParticipantPanel from '../components/ParticipantPanel';
import AdmissionRequestPanel from '../components/AdmissionRequestPanel';
import { toast } from 'react-toastify';
import { Clipboard, Video as VideoIcon, ArrowLeft, Share2, Menu, RefreshCw } from 'lucide-react';
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
  const [createdBy, setCreatedBy] = useState(null);
  const [loading, setLoading] = useState(true);

  // Read initial device states from lobby redirect
  const { initialMic = true, initialCamera = true, selectedCameraId = null, selectedMicId = null } = location.state || {};

  useEffect(() => {
    const fetchToken = async () => {
      const randomUid = Math.floor(Math.random() * 100000) + 1;
      try {
        // Retrieve room details / validate to check createdBy
        const valRes = await api.get(`/api/meetings/validate/${roomId}`);
        setCreatedBy(valRes.data.createdBy || null);

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
        console.error('Failed to initialize meeting room:', err);
        toast.error('Failed to validate meeting room. Redirecting...');
        navigate('/dashboard');
      }
    };

    fetchToken();
  }, [roomId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-tertiary">
        <div className="w-10 h-10 border-3 border-surface border-t-brand rounded-full animate-spin" />
        <p className="text-offwhite/50 font-[Outfit] text-sm tracking-wide">
          Connecting to secure meeting channel...
        </p>
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
        selectedCameraId={selectedCameraId}
        selectedMicId={selectedMicId}
        createdBy={createdBy}
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
  selectedCameraId,
  selectedMicId,
  createdBy,
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

  // Admission control state
  const isHost = user?.email && createdBy && user.email === createdBy;
  const [admissionRequests, setAdmissionRequests] = useState([]);
  const admissionPollIntervalRef = useRef(null);

  // Active Camera ID state and flip handler
  const [activeCameraId, setActiveCameraId] = useState(selectedCameraId);

  const handleFlipCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length <= 1) {
        toast.info('No other camera detected to switch to.');
        return;
      }
      
      let currentIndex = videoDevices.findIndex(d => d.deviceId === activeCameraId);
      if (currentIndex === -1) {
        currentIndex = 0;
      }
      
      const nextIndex = (currentIndex + 1) % videoDevices.length;
      const nextCamera = videoDevices[nextIndex];
      
      setActiveCameraId(nextCamera.deviceId);
      toast.info(`Switched camera to: ${nextCamera.label || 'Next camera'}`);
    } catch (err) {
      console.error('Failed to flip camera:', err);
      toast.error('Failed to switch camera.');
    }
  };

  // Poll for pending admission requests if host
  useEffect(() => {
    if (!isHost) return;

    const fetchPendingAdmissions = async () => {
      try {
        const response = await api.get(`/api/meetings/admission/pending/${roomId}`);
        setAdmissionRequests(response.data || []);
      } catch (err) {
        console.error('Failed to fetch pending admissions:', err);
      }
    };

    fetchPendingAdmissions();
    admissionPollIntervalRef.current = setInterval(fetchPendingAdmissions, 3000);

    return () => {
      if (admissionPollIntervalRef.current) {
        clearInterval(admissionPollIntervalRef.current);
      }
    };
  }, [isHost, roomId]);

  const handleAdmissionResponded = (requestId) => {
    setAdmissionRequests(prev => prev.filter(req => req.requestId !== requestId));
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
    if (!remoteUid) return 'Participant';
    return (participantNames && participantNames[String(remoteUid)]) || `Participant ${remoteUid}`;
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
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(
    micActive,
    selectedMicId ? { microphoneId: selectedMicId } : undefined
  );
  const { localCameraTrack } = useLocalCameraTrack(
    cameraActive,
    selectedCameraId ? { cameraId: selectedCameraId } : undefined
  );

  // Dynamic camera device switching via Agora setDevice API
  useEffect(() => {
    if (localCameraTrack && activeCameraId) {
      localCameraTrack.setDevice(activeCameraId)
        .then(() => {
          console.log('Successfully switched Agora camera to device:', activeCameraId);
        })
        .catch(err => {
          console.error('Failed to set camera device in Agora:', err);
        });
    }
  }, [activeCameraId, localCameraTrack]);

  // 3. Publish local video/audio tracks
  const tracksToPublish = [];
  if (localMicrophoneTrack) tracksToPublish.push(localMicrophoneTrack);
  if (localCameraTrack) tracksToPublish.push(localCameraTrack);
  usePublish(tracksToPublish);

  // 4. Retrieve remote users in the channel and subscribe to their tracks
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  useRemoteVideoTracks(remoteUsers);

  // Re-fetch participant names when remote users list changes (new user joined/left)
  useEffect(() => {
    if (remoteUsers) {
      fetchParticipantNames();
    }
  }, [remoteUsers?.length, fetchParticipantNames]);

  // 5. Play remote users' audio automatically
  useEffect(() => {
    if (audioTracks) {
      audioTracks.forEach((track) => {
        if (track) {
          try {
            if (!track.isPlaying) {
              track.play();
            }
          } catch (err) {
            console.error('Failed to play remote audio track:', err);
          }
        }
      });
    }
  }, [audioTracks]);

  // 6. Handle device activation changes
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

  // 7. Screen Share toggle
  const handleToggleScreenShare = async () => {
    if (screenShareActive) {
      // Stop screen share
      if (screenTrack) {
        await client.unpublish(screenTrack);
        screenTrack.close();
        setScreenTrack(null);
      }
      setScreenShareActive(false);
      
      // Re-enable camera track
      if (localCameraTrack && cameraActive) {
        await client.publish(localCameraTrack);
        localCameraTrack.setEnabled(true);
      }
    } else {
      try {
        // Start screen share
        const track = await AgoraRTC.createScreenVideoTrack();
        setScreenTrack(track);
        setScreenShareActive(true);

        // Unpublish camera track if active
        if (localCameraTrack) {
          await client.unpublish(localCameraTrack);
        }

        await client.publish(track);

        // Listen for screen share stop from browser control
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

    if (admissionPollIntervalRef.current) {
      clearInterval(admissionPollIntervalRef.current);
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
    toast.success('Room link copied to clipboard!');
  };

  // Determine grid layout
  const totalTiles = (remoteUsers?.length || 0) + 1;
  const getGridCols = () => {
    if (totalTiles === 1) return 'grid-cols-1';
    if (totalTiles === 2) return 'grid-cols-1 md:grid-cols-2';
    if (totalTiles === 3) return 'grid-cols-1 md:grid-cols-2';
    if (totalTiles === 4) return 'grid-cols-2';
    return 'grid-cols-2 md:grid-cols-3';
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-tertiary overflow-hidden font-[Outfit]">
      
      {/* ── Topbar ── */}
      <header className="flex items-center justify-between px-3 sm:px-4 h-14 bg-secondary/80 backdrop-blur-xl border-b border-border-primary/45 shrink-0 z-20">
        {/* Left side — Back + Meeting info */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          {/* Back button */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface hover:bg-surface-hover flex items-center justify-center text-offwhite transition-all duration-150 cursor-pointer shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          
          {/* Meeting title pill */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1.5 bg-surface/60 rounded-full border border-border-primary/40 min-w-0">
            <div className="w-2 h-2 rounded-full bg-brand animate-pulse shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-white leading-tight truncate">
                Team Meeting
              </span>
              <span className="text-[9px] sm:text-[10px] text-offwhite/50 leading-tight truncate">
                Host <span className="text-brand font-medium">{user?.name || 'You'}</span>
              </span>
            </div>
          </div>

          {/* Share button */}
          <button 
            onClick={copyRoomLink}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand text-secondary flex items-center justify-center hover:bg-brand-hover transition-all duration-150 active:scale-95 shadow-md shadow-brand/20 cursor-pointer shrink-0"
            title="Copy Invite Link"
          >
            <Share2 size={14} />
          </button>
        </div>

        {/* Right side — User avatar + menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-xs text-offwhite/50 hidden sm:inline mr-1">
            {user?.name || 'Guest'}
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-brand to-brand-hover text-secondary text-xs flex items-center justify-center font-bold shadow-md shadow-brand/25">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
          </div>
          <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface hover:bg-surface-hover flex items-center justify-center text-offwhite transition-all duration-150 cursor-pointer">
            <Menu size={16} />
          </button>
        </div>
      </header>

      {/* ── Main Body ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid Area */}
        <div className="flex-1 p-3 pb-24 overflow-auto">
          <div className={`grid ${getGridCols()} gap-3 h-full auto-rows-fr`}>
            {/* Local participant video tile */}
            <VideoTile
              track={screenShareActive ? screenTrack : localCameraTrack}
              isLocal={true}
              name={`${user?.name || 'You'}${screenShareActive ? ' (Screen)' : ''}`}
              videoActive={screenShareActive ? true : cameraActive}
              audioActive={micActive}
              onFlipCamera={handleFlipCamera}
            />

            {/* Remote participants video tiles */}
            {remoteUsers && remoteUsers.map((remoteUser) => (
              remoteUser && remoteUser.uid ? (
                <VideoTile
                  key={remoteUser.uid}
                  user={remoteUser}
                  isLocal={false}
                  name={getRemoteUserName(remoteUser.uid)}
                  videoActive={remoteUser.hasVideo}
                  audioActive={remoteUser.hasAudio}
                />
              ) : null
            ))}
          </div>
        </div>

        {/* Side Panels */}
        {chatOpen && (
          <ChatPanel roomId={roomId} onClose={() => setChatOpen(false)} />
        )}
        
        {participantsOpen && (
          <ParticipantPanel 
            remoteUsers={remoteUsers} 
            participantNames={participantNames}
            onClose={() => setParticipantsOpen(false)} 
          />
        )}
      </div>

      {/* Controls Footer — floating, rendered by ControlBar */}
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

      {isHost && (
        <AdmissionRequestPanel 
          admissionRequests={admissionRequests}
          onResponded={handleAdmissionResponded}
        />
      )}
    </div>
  );
};

export default MeetingRoomPage;
