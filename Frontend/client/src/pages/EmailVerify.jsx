import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import ThemeToggle from "../components/ThemeToggle.jsx";

const EmailVerify = () => {
  const inputRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const { getUserData, isLoggedIn, userData, backendURL } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    e.target.value = value;
    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).split("");
    paste.forEach((digit, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = digit;
      }
    });
    const next = paste.length < 6 ? paste.length : 5;
    inputRef.current[next].focus();
  };

  const handleVerify = async () => {
    const otp = inputRef.current.map(input => input.value).join("");
    if (otp.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendURL}/verify-otp`, { otp });
      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        getUserData();
        navigate("/");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 dark:from-gray-900 dark:to-gray-800 relative px-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Logo */}
      <Link to="/" className="absolute top-4 left-4 flex items-center gap-2">
        <img src={assets.logo} alt="MeetNow Logo" className="h-8 w-8" />
        <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MeetNow</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Please enter the 6-digit OTP sent to your email address.
        </p>

        <div className="flex justify-between gap-2 mb-6">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-12 h-14 text-center text-xl border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              ref={(el) => (inputRef.current[i] = el)}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerify;
