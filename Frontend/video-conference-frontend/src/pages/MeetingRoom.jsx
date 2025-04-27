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
  MessageCircle,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import ChatPanel from "../components/ChatPanel";

const iconButtonStyle =
  "p-3 rounded-full text-white bg-gray-700 hover:bg-gray-600 dark:bg-gray-300 dark:text-black transition duration-300";

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

  const isConnected = useIsConnected();
  const remoteUsers = useRemoteUsers();
  const screenTrackRef = useRef(null);

  const appId = "6c644d6152df412280e149a1dec55935";
  const channel = meetingCode || "default-channel";
  const token = "007eJxTYJhxvO34rFjDV3xnY41WKgVb3P22sL7FTmjL95bXHonemywUGMySzUxMUswMTY1S0kwMjYwsDFINTSwTDVNSk01NLY1ND1XyZDQEMjJM7HJjZmSAQBCflaEsMyU1n4EBAIEuH4U=";

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

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <VideoIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            MeetNow {meetingCode && `- ${meetingCode}`}
          </span>
        </div>
        <ThemeToggle />
      </nav>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video section */}
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <LocalUser
              audioTrack={micOn ? localMicrophoneTrack : null}
              cameraOn={cameraOn}
              micOn={micOn}
              playAudio={false}
              videoTrack={cameraOn ? localCameraTrack : null}
              style={{ width: "100%", height: "100%" }}
            >
              <span>{userName}</span>
            </LocalUser>

            {remoteUsers.map(user => (
              <RemoteUser
                key={user.uid}
                user={user}
                style={{ width: "100%", height: "100%" }}
              >
                <span>{user.uid}</span>
              </RemoteUser>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-4 flex justify-center gap-4 text-xl">
            <button
              onClick={toggleMic}
              title={micOn ? "Mute Microphone" : "Unmute Microphone"}
              className={iconButtonStyle}
            >
              {micOn ? <Mic /> : <MicOff />}
            </button>

            <button
              onClick={toggleCamera}
              title={cameraOn ? "Turn Off Camera" : "Turn On Camera"}
              className={iconButtonStyle}
            >
              {cameraOn ? <VideoIcon /> : <VideoOff />}
            </button>

            <button
              onClick={startScreenShare}
              title="Share Screen"
              className={iconButtonStyle}
            >
              <Monitor />
            </button>

            <button
              onClick={() => setChatOpen(prev => !prev)}
              title="Toggle Chat"
              className={iconButtonStyle}
            >
              <MessageCircle />
            </button>

            <button
              onClick={leaveMeeting}
              title="Leave Meeting"
              className={`${iconButtonStyle} bg-red-500 hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500`}
            >
              <PhoneOff />
            </button>
          </div>
        </div>

        {/* Chat section */}
        {chatOpen && isConnected && (
          <ChatPanel
            messages={messages}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            sendMessage={sendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingRoom;
