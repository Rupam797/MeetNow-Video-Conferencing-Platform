import { useState, useRef, useEffect } from "react";
import { Video, LogIn, User, LogOut } from "lucide-react";
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
import { useNavigate } from "react-router";

export default function Dashboard({ user, onCreateMeeting, onLogout }) {
  const [meetingCode, setMeetingCode] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (meetingCode.trim() && userName.trim()) {
      navigate("/MeetingLobby", { 
        state: { 
          userName,
          meetingCode 
        } 
      });
    }
  };

  const handleStartMeeting = () => {
    if (userName.trim()) {
      navigate("/MeetingLobby", { 
        state: { 
          userName 
        } 
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="w-full px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              MeetNow
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {user?.name || "User"}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                  <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="relative mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Welcome, {user?.name || "User"}
              </h1>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl text-lg leading-relaxed">
              Create or join virtual meetings with multiple participants, share
              your screen, and chat in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Start Meeting Card */}
            <Card className="bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
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
                    className="w-full border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
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

            {/* Join Meeting Card */}
            <Card className="bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
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
                    className="w-full border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                  />
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
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