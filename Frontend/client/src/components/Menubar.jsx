import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import ThemeToggle from "./ThemeToggle.jsx";
import { ArrowRight, MailCheck, LogOut } from "lucide-react";

const Menubar = () => {
  const navigate = useNavigate();
  const { userData, backendURL, setUserData, setIsLoggedIn } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendURL + "/logout");
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendURL + "/send-otp");
      if (response.status === 200) {
        navigate("/email-verify");
        toast.success("OTP has been sent successfully.");
      } else {
        toast.error("Unable to send OTP!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-800 px-8 py-4 flex justify-between items-center shadow-sm border-b border-gray-100 dark:border-gray-700">
      {/* Left - Logo & Text */}
      <div className="flex items-center gap-3">
        <img 
          src={assets.logo_home} 
          alt="logo" 
          width={36} 
          height={36}
        />
        <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          MeetNow
        </span>
      </div>

      {/* Right - ThemeToggle & Auth */}
      <div className="flex items-center gap-6">
        <ThemeToggle />

        {userData ? (
          <div className="relative" ref={dropdownRef}>
            {/* Avatar */}
            <div 
              className="bg-blue-600 dark:bg-blue-400 text-white rounded-full flex justify-center items-center w-10 h-10 cursor-pointer select-none"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {userData.name[0].toUpperCase()}
            </div>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50 border border-gray-100 dark:border-gray-600">
                {!userData.isAccountVerified && (
                  <button
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600"
                    onClick={sendVerificationOtp}
                  >
                    <MailCheck className="w-4 h-4" />
                    Verify email
                  </button>
                )}
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-500 hover:bg-blue-50 dark:hover:bg-gray-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
            onClick={() => navigate("/login")}
          >
            Login <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Menubar;
