import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { Video, Mic, MicOff, Video as VideoIcon, VideoOff, Check, X } from "lucide-react";
import Button from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ThemeToggle from "../components/ThemeToggle";

export default function MeetingLobby() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const { userName, meetingCode } = location.state || {};
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [devices, setDevices] = useState({
    audio: true,
    video: true
  });
  const [stream, setStream] = useState(null);

  // New: Device lists
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedMicId, setSelectedMicId] = useState('');
  const [selectedCameraId, setSelectedCameraId] = useState('');

  useEffect(() => {
    const checkDevices = async () => {
      try {
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const hasAudio = deviceInfos.some(device => device.kind === 'audioinput');
        const hasVideo = deviceInfos.some(device => device.kind === 'videoinput');

        setDevices({
          audio: hasAudio,
          video: hasVideo
        });

        const audios = deviceInfos.filter(device => device.kind === 'audioinput');
        const videos = deviceInfos.filter(device => device.kind === 'videoinput');

        setAudioDevices(audios);
        setVideoDevices(videos);

        // Set default selected devices
        if (audios.length > 0) setSelectedMicId(audios[0].deviceId);
        if (videos.length > 0) setSelectedCameraId(videos[0].deviceId);

        if (hasVideo && cameraOn) {
          startVideoPreview(videos[0]?.deviceId);
        }
      } catch (error) {
        console.error("Error checking devices:", error);
      }
    };

    checkDevices();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (cameraOn && devices.video) {
      startVideoPreview(selectedCameraId);
    } else {
      stopVideoPreview();
    }
  }, [cameraOn, selectedCameraId]);

  const startVideoPreview = async (deviceId) => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error("Error starting video preview:", error);
      setDevices(prev => ({ ...prev, video: false }));
      setCameraOn(false);
    }
  };

  const stopVideoPreview = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }
  };

  const toggleMic = () => {
    if (devices.audio) {
      setMicOn(prev => !prev);
    }
  };

  const toggleCamera = () => {
    if (devices.video) {
      setCameraOn(prev => !prev);
    }
  };

  const handleJoinMeeting = () => {
    navigate("/Meetingroom", { 
      state: { 
        userName,
        meetingCode,
        initialSettings: {
          micOn,
          cameraOn,
          selectedMicId,
          selectedCameraId
        }
      } 
    });
  };

  if (!userName) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              MeetNow
            </span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
            {meetingCode ? `Join Meeting: ${meetingCode}` : "Ready to Meet?"}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Set up your audio and video before joining
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Preview Section */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <VideoIcon className="h-5 w-5 mr-2" />
                  Preview
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Check how you'll appear to others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video overflow-hidden">
                  {cameraOn && devices.video ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
                      <div className="w-24 h-24 rounded-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings Section */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Meeting Settings</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Configure your audio and video
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Participant Info */}
                  <div>
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      You'll join as
                    </h3>
                    <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <p className="font-medium">{userName}</p>
                    </div>
                  </div>

                  {/* Device Status and Selection */}
                  <div>
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Device Settings
                    </h3>
                    <div className="space-y-4">
                      {/* Microphone */}
                      <div className="flex flex-col space-y-2">
                        <label className="text-gray-600 dark:text-gray-300">Microphone</label>
                        {devices.audio ? (
                          <>
                            <select
                              value={selectedMicId}
                              onChange={(e) => setSelectedMicId(e.target.value)}
                              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700"
                            >
                              {audioDevices.map(device => (
                                <option key={device.deviceId} value={device.deviceId}>
                                  {device.label || `Mic ${device.deviceId}`}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center justify-between">
                              <span>{micOn ? "On" : "Off"}</span>
                              <button
                                onClick={toggleMic}
                                className={`p-2 rounded-full ${micOn ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                              >
                                {micOn ? <Mic /> : <MicOff />}
                              </button>
                            </div>
                          </>
                        ) : (
                          <span className="text-red-500 flex items-center">
                            <X className="h-4 w-4 mr-1" /> Not detected
                          </span>
                        )}
                      </div>

                      {/* Camera */}
                      <div className="flex flex-col space-y-2">
                        <label className="text-gray-600 dark:text-gray-300">Camera</label>
                        {devices.video ? (
                          <>
                            <select
                              value={selectedCameraId}
                              onChange={(e) => setSelectedCameraId(e.target.value)}
                              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700"
                            >
                              {videoDevices.map(device => (
                                <option key={device.deviceId} value={device.deviceId}>
                                  {device.label || `Camera ${device.deviceId}`}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center justify-between">
                              <span>{cameraOn ? "On" : "Off"}</span>
                              <button
                                onClick={toggleCamera}
                                className={`p-2 rounded-full ${cameraOn ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                              >
                                {cameraOn ? <VideoIcon /> : <VideoOff />}
                              </button>
                            </div>
                          </>
                        ) : (
                          <span className="text-red-500 flex items-center">
                            <X className="h-4 w-4 mr-1" /> Not detected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Join Button */}
                  <Button
                    onClick={handleJoinMeeting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 py-3 text-lg"
                  >
                    Join Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
