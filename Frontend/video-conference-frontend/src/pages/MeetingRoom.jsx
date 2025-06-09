import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  AgoraRTCProvider,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  useIsConnected,
  LocalUser,
  RemoteUser,
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-react";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Monitor,
  MessageSquare,
  MoreVertical,
  User,
  Settings,
  Shield,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import ChatPanel from "../components/ChatPanel";

const MeetingRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userName, meetingCode, initialSettings } = location.state || {};

  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  if (!userName) {
    navigate("/");
    return null;
  }

  return (
    <AgoraRTCProvider client={client}>
      <MeetingContent 
        userName={userName} 
        meetingCode={meetingCode} 
        initialSettings={initialSettings} 
      />
    </AgoraRTCProvider>
  );
};

const MeetingContent = ({ userName, meetingCode, initialSettings }) => {
  const [micOn, setMicOn] = useState(initialSettings?.micOn ?? true);
  const [cameraOn, setCameraOn] = useState(initialSettings?.cameraOn ?? true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [calling, setCalling] = useState(true);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isConnected = useIsConnected();
  const remoteUsers = useRemoteUsers();
  const screenTrackRef = useRef(null);

  const appId = "6c644d6152df412280e149a1dec55935";
  const channel = "video";
  const token = "007eJxTYMh4zd2TM4dH4/38U/zmU+7Fls1JqpkWMm17xD1llRvabPcVGMySzUxMUswMTY1S0kwMjYwsDFINTSwTDVNSk01NLY1Nl94VyWgIZGRY82gLMyMDBIL4rAxlmSmp+QwMADzhH5c=";

  useJoin({ appid: appId, channel, token, uid: userName }, calling);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { localCameraTrack } = useLocalCameraTrack();

  usePublish([
    micOn ? localMicrophoneTrack : null,
    cameraOn ? localCameraTrack : null
  ]);

  const toggleMic = () => {
    if (localMicrophoneTrack) {
      const newState = !micOn;
      localMicrophoneTrack.setEnabled(newState);
      setMicOn(newState);
    }
  };

  const toggleCamera = () => {
    if (localCameraTrack) {
      const newState = !cameraOn;
      localCameraTrack.setEnabled(newState);
      setCameraOn(newState);
    }
  };

  const startScreenShare = async () => {
    if (!screenSharing) {
      const screenTrack = await AgoraRTC.createScreenVideoTrack();
      screenTrackRef.current = screenTrack;
      await client.publish(screenTrack);
      setScreenSharing(true);
    } else {
      if (screenTrackRef.current) {
        await client.unpublish(screenTrackRef.current);
        screenTrackRef.current.close();
      }
      setScreenSharing(false);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      setMessages(prev => [...prev, { user: userName, text: messageInput }]);
      setMessageInput("");
    }
  };

  const leaveMeeting = () => {
    setCalling(false);
    navigate("/");
  };

  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(micOn);
    }
  }, [micOn, localMicrophoneTrack]);

  useEffect(() => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(cameraOn);
    }
  }, [cameraOn, localCameraTrack]);

  // Calculate grid layout based on number of participants
  const totalParticipants = remoteUsers.length + 1; // +1 for local user
  const getGridClass = () => {
    if (totalParticipants <= 2) return "grid-cols-1";
    if (totalParticipants <= 4) return "grid-cols-2";
    if (totalParticipants <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Top bar */}
      <div className="w-full px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <VideoIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
              MeetNow
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {meetingCode}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video grid */}
        <div className={`flex-1 p-4 overflow-auto ${chatOpen || participantsOpen ? 'w-3/4' : 'w-full'}`}>
          <div className={`grid ${getGridClass()} gap-4 h-full`}>
            <div className="relative bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
              <LocalUser
                audioTrack={micOn ? localMicrophoneTrack : null}
                cameraOn={cameraOn}
                micOn={micOn}
                playAudio={false}
                videoTrack={cameraOn ? localCameraTrack : null}
                style={{ width: "100%", height: "100%" }}
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                {userName} (You)
              </div>
              {!cameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="text-gray-400 h-8 w-8" />
                  </div>
                </div>
              )}
            </div>

            {remoteUsers.map(user => (
              <div key={user.uid} className="relative bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                <RemoteUser
                  user={user}
                  style={{ width: "100%", height: "100%" }}
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                  {user.uid}
                </div>
                {!user.hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                      <User className="text-gray-400 h-8 w-8" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        {(chatOpen || participantsOpen) && (
          <div className="w-1/4 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                {participantsOpen ? 'Participants' : 'Chat'}
              </h3>
              <button 
                onClick={() => {
                  setChatOpen(false);
                  setParticipantsOpen(false);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            
            {participantsOpen ? (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <User className="text-blue-600 dark:text-blue-300 h-4 w-4" />
                  </div>
                  <span className="text-gray-800 dark:text-gray-200">
                    {userName} (You)
                  </span>
                </div>
                {remoteUsers.map(user => (
                  <div key={user.uid} className="flex items-center space-x-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="text-gray-600 dark:text-gray-300 h-4 w-4" />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200">
                      {user.uid}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <ChatPanel
                messages={messages}
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                sendMessage={sendMessage}
                userName={userName}
              />
            )}
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="w-full py-3 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-center items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMic}
            className={`p-2 rounded-full ${micOn ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600' : 'bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800'}`}
            title={micOn ? "Mute" : "Unmute"}
          >
            {micOn ? (
              <Mic className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            ) : (
              <MicOff className="h-5 w-5 text-red-600 dark:text-red-300" />
            )}
          </button>
          <span className="text-xs text-gray-600 dark:text-gray-400">Mic</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleCamera}
            className={`p-2 rounded-full ${cameraOn ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600' : 'bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800'}`}
            title={cameraOn ? "Turn off camera" : "Turn on camera"}
          >
            {cameraOn ? (
              <VideoIcon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            ) : (
              <VideoOff className="h-5 w-5 text-red-600 dark:text-red-300" />
            )}
          </button>
          <span className="text-xs text-gray-600 dark:text-gray-400">Camera</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={startScreenShare}
            className={`p-2 rounded-full ${screenSharing ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
            title="Share screen"
          >
            <Monitor className={`h-5 w-5 ${screenSharing ? 'text-blue-600 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`} />
          </button>
          <span className="text-xs text-gray-600 dark:text-gray-400">Share</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setParticipantsOpen(true);
              setChatOpen(false);
            }}
            className={`p-2 rounded-full ${participantsOpen ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
            title="Participants"
          >
            <User className={`h-5 w-5 ${participantsOpen ? 'text-blue-600 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`} />
          </button>
          <span className="text-xs text-gray-600 dark:text-gray-400">People</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setChatOpen(true);
              setParticipantsOpen(false);
            }}
            className={`p-2 rounded-full ${chatOpen ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
            title="Chat"
          >
            <MessageSquare className={`h-5 w-5 ${chatOpen ? 'text-blue-600 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`} />
          </button>
          <span className="text-xs text-gray-600 dark:text-gray-400">Chat</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            title="Settings"
          >
            <Settings className="h-5 w-5 text-gray-800 dark:text-gray-200" />
          </button>
        </div>

        <button
          onClick={leaveMeeting}
          className="ml-4 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
        >
          <PhoneOff className="h-5 w-5" />
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
};

export default MeetingRoom;