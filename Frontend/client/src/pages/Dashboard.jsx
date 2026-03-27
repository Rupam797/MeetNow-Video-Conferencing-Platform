import { useState, useContext } from "react";
import { Video, LogIn } from "lucide-react";
import Button from "../ui/Button";
import ThemeToggle from "../components/ThemeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Input from "../ui/Input";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import Menubar from "../components/Menubar.jsx";
import axios from "axios";
import { toast } from "react-toastify";

// Reusable gradient bar component
const GradientBar = ({ from, to }) => (
  <div
    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${from} to-${to}`}
  />
);

export default function Dashboard({ onCreateMeeting }) {
  const { meetingCode: urlMeetingCode } = useParams();
  const [meetingCode, setMeetingCode] = useState(urlMeetingCode || "");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { userData, backendURL } = useContext(AppContext);

  const generateMeetingCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 8 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  const handleJoinMeeting = async (e) => {
    e.preventDefault();
    if (meetingCode.trim() && userName.trim()) {
      try {
        const response = await axios.get(`${backendURL}/api/meetings/validate/${meetingCode}`);
        if (response.status === 200) {
          navigate(`/Meetinglobby/${meetingCode}`, {
            state: {
              userName,
            },
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Invalid Meeting Link or Room Does Not Exist");
      }
    }
  };

  const handleStartMeeting = async () => {
    if (userName.trim()) {
      try {
        const newMeetingCode = generateMeetingCode();
        if (onCreateMeeting) onCreateMeeting(newMeetingCode);
        
        await axios.post(`${backendURL}/api/meetings/create`, { roomId: newMeetingCode, createdBy: userName });
        
        navigate(`/Meetinglobby/${newMeetingCode}`, {
          state: {
            userName,
          },
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to save meeting room");
      }
    }
  };

  return (
    <>
      <Menubar />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="relative mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Welcome, {userData?.name || "User"}
              </h1>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl text-lg leading-relaxed">
              Create or join virtual meetings with multiple participants, share
              your screen, and chat in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Start Meeting */}
            <Card className="relative bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
              <GradientBar from="blue-500" to="indigo-600" />
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                    <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Start a Meeting
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Create a new meeting and invite others to join
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    onClick={handleStartMeeting}
                    disabled={!userName.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    New Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Join Meeting */}
            <Card className="relative bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
              <GradientBar from="indigo-500" to="purple-600" />
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-3">
                    <LogIn className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Join a Meeting
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Enter a meeting code to join an existing meeting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinMeeting} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter meeting code"
                    value={meetingCode}
                    onChange={(e) => setMeetingCode(e.target.value)}
                    className="w-full"
                  />
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={!meetingCode.trim() || !userName.trim()}
                  >
                    Join Meeting
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
