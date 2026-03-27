import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  User,
  Settings,
  Loader2,
  Copy,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { toast } from "react-toastify";

// Initialize the client OUTSIDE the component so it doesn't get recreated on every React re-render!
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const MeetingRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { meetingCode } = useParams();
  const { userName, initialSettings } = location.state || {};

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
        client={client}
      />
    </AgoraRTCProvider>
  );
};

const MeetingContent = ({ userName, meetingCode, initialSettings, client }) => {
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(initialSettings?.micOn ?? true);
  const [cameraOn, setCameraOn] = useState(initialSettings?.cameraOn ?? true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isScreenShareLoading, setIsScreenShareLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [calling, setCalling] = useState(true);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isConnected = useIsConnected();
  const remoteUsers = useRemoteUsers();
  const screenTrackRef = useRef(null);



  // Agora credentials
  const appId = import.meta.env.VITE_AGORA_APP_ID;
  const channel = meetingCode; // Use the unique meeting code so users get their own dynamic rooms

  // Force token to null to guarantee Testing Mode connects without triggering token timeout errors
  useJoin({ appid: appId, channel, token: null, uid: userName }, calling);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { localCameraTrack } = useLocalCameraTrack();
  usePublish([
    micOn ? localMicrophoneTrack : null,
    cameraOn ? localCameraTrack : null,
    ...(screenTrackRef.current 
      ? (Array.isArray(screenTrackRef.current) 
        ? screenTrackRef.current 
        : [screenTrackRef.current]) 
      : [])
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

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/join/${meetingCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Meeting link copied!");
  };

  const stopScreenShare = async () => {
    if (screenTrackRef.current) {
      const tracks = Array.isArray(screenTrackRef.current) 
        ? screenTrackRef.current 
        : [screenTrackRef.current];
      
      try {
        await Promise.all(tracks.map(track => {
          if (track) {
            client.unpublish(track);
            track.close();
          }
          return null;
        }));
      } catch (error) {
        console.error("Error stopping screen share:", error);
      }
      
      screenTrackRef.current = null;
    }
    
    if (cameraOn && localCameraTrack) {
      await client.publish(localCameraTrack);
    }
    
    setScreenSharing(false);
  };

  const startScreenShare = async () => {
    try {
      if (screenSharing) {
        await stopScreenShare();
        return;
      }

      setIsScreenShareLoading(true);
      
      const screenTrack = await AgoraRTC.createScreenVideoTrack(
        { encoderConfig: "1080p_1" },
        "auto"
      ).catch(error => {
        if (error.name === 'NotAllowedError') {
          alert('Screen sharing permission was denied. Please allow screen sharing to continue.');
        }
        throw error;
      });

      const tracks = Array.isArray(screenTrack) ? screenTrack : [screenTrack];
      
      if (localCameraTrack) {
        await client.unpublish(localCameraTrack);
      }

      await client.publish(tracks);
      screenTrackRef.current = tracks;

      tracks.forEach(track => {
        track.on("track-ended", async () => {
          await stopScreenShare();
        });
      });

      setScreenSharing(true);
    } catch (error) {
      console.error("Screen share error:", error);
      setScreenSharing(false);
    } finally {
      setIsScreenShareLoading(false);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        user: userName,
        text: messageInput,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMessage]);
      setMessageInput("");
    }
  };

  const leaveMeeting = async () => {
    try {
      if (screenSharing) {
        await stopScreenShare();
      }
      
      await client.leave();
      
      if (localMicrophoneTrack) {
        localMicrophoneTrack.close();
      }
      if (localCameraTrack) {
        localCameraTrack.close();
      }
      
      setCalling(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error leaving meeting:", error);
      navigate("/dashboard");
    }
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

  useEffect(() => {
    return () => {
      if (screenTrackRef.current) {
        stopScreenShare();
      }
    };
  }, []);

  const totalParticipants = remoteUsers.length + 1;
  const getGridClass = () => {
    if (totalParticipants <= 2) return "grid-cols-1";
    if (totalParticipants <= 4) return "grid-cols-2";
    if (totalParticipants <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  const ChatPanel = ({
    messages,
    messageInput,
    setMessageInput,
    sendMessage,
    userName
  }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    return (
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.user === userName ? "text-right" : ""}`}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {message.user === userName ? "You" : message.user}
              </div>
              <div
                className={`inline-block px-4 py-2 rounded-lg ${
                  message.user === userName
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {message.text}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
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
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
            <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">
              {meetingCode}
            </span>
            <button 
              onClick={copyMeetingLink}
              className="p-1 rounded text-gray-500 hover:text-blue-600 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-blue-400 transition-colors"
              title="Copy Meeting Link"
            >
              <Copy className="h-4 w-4" />
            </button>
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
        <div className={`flex-1 p-4 overflow-auto ${chatOpen || participantsOpen ? 'w-3/4' : 'w-full'}`}>
          <div className={`grid ${getGridClass()} gap-4 h-full`}>
            {/* Local user */}
            <div className="relative bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
              <LocalUser
                audioTrack={micOn ? localMicrophoneTrack : null}
                cameraOn={screenSharing ? false : cameraOn}
                micOn={micOn}
                playAudio={false}
                videoTrack={screenSharing ? null : (cameraOn ? localCameraTrack : null)}
                style={{ width: "100%", height: "100%" }}
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                {userName} (You)
              </div>
              {(!cameraOn && !screenSharing) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="text-gray-400 h-8 w-8" />
                  </div>
                </div>
              )}
            </div>

            {/* Real remote users */}
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
        {/* Mic */}
        <ControlButton
          active={micOn}
          onClick={toggleMic}
          IconOn={Mic}
          IconOff={MicOff}
          label="Mic"
        />

        {/* Camera */}
        <ControlButton
          active={cameraOn}
          onClick={toggleCamera}
          IconOn={VideoIcon}
          IconOff={VideoOff}
          label="Camera"
        />

        {/* Screen Share */}
        <ControlButton
          active={screenSharing}
          onClick={startScreenShare}
          IconOn={Monitor}
          IconOff={Monitor}
          label={isScreenShareLoading ? "Loading..." : "Share"}
          disabled={isScreenShareLoading}
          loading={isScreenShareLoading}
        />

        {/* Participants */}
        <ControlButton
          active={participantsOpen}
          onClick={() => {
            setParticipantsOpen(true);
            setChatOpen(false);
          }}
          IconOn={User}
          IconOff={User}
          label="People"
        />

        {/* Chat */}
        <ControlButton
          active={chatOpen}
          onClick={() => {
            setChatOpen(true);
            setParticipantsOpen(false);
          }}
          IconOn={MessageSquare}
          IconOff={MessageSquare}
          label="Chat"
        />

        {/* Settings */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          title="Settings"
        >
          <Settings className="h-5 w-5 text-gray-800 dark:text-gray-200" />
        </button>

        {/* Leave */}
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

const ControlButton = ({ 
  active, 
  onClick, 
  IconOn, 
  IconOff, 
  label, 
  disabled = false,
  loading = false 
}) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-full ${
        active
          ? "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          : disabled
          ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
          : "bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
      }`}
      title={label}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />
      ) : active ? (
        <IconOn className="h-5 w-5 text-gray-800 dark:text-gray-200" />
      ) : (
        <IconOff className={`h-5 w-5 ${disabled ? "text-gray-400 dark:text-gray-500" : "text-red-600 dark:text-red-300"}`} />
      )}
    </button>
    <span className={`text-xs ${disabled ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-400"}`}>
      {label}
    </span>
  </div>
);

export default MeetingRoom;