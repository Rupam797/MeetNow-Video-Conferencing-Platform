import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import ThemeToggle from "../components/ThemeToggle.jsx";

const ResetPassword = () => {
    const inputRef = useRef([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
    const { backendURL } = useContext(AppContext);

    axios.defaults.withCredentials = true;

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

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${backendURL}/send-reset-otp?email=${email}`);
            if (response.status === 200) {
                toast.success("Password reset OTP sent successfully.");
                setIsEmailSent(true);
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = () => {
        const enteredOtp = inputRef.current.map((input) => input.value).join("");
        if (enteredOtp.length !== 6) {
            toast.error("Please enter all 6 digits of the OTP.");
            return;
        }
        setOtp(enteredOtp);
        setIsOtpSubmitted(true);
    };

    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${backendURL}/reset-password`, { email, otp, newPassword });
            if (response.status === 200) {
                toast.success("Password reset successfully.");
                navigate("/login");
            } else {
                toast.error("Invalid OTP or email.");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-gray-900 dark:to-gray-800 p-4">

            {/* Logo */}
            <Link to="/" className="absolute top-6 left-6 flex items-center gap-2">
                <img src={assets.logo} alt="MeetNow Logo" className="h-8 w-8 " />
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MeetNow</span>
            </Link>

            {/* Theme Toggle */}
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            {/* Card */}
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                {!isEmailSent && (
                    <>
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
                            Reset Password
                        </h2>
                        <p className="text-center text-gray-500 dark:text-gray-300 mb-6">
                            Enter your registered email address
                        </p>
                        <form onSubmit={onSubmitEmail} className="space-y-4">
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        </form>
                    </>
                )}

                {!isOtpSubmitted && isEmailSent && (
                    <>
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
                            Verify OTP
                        </h2>
                        <p className="text-center text-gray-500 dark:text-gray-300 mb-6">
                            Enter the 6-digit code sent to your email
                        </p>
                        <div className="flex justify-between gap-2 mb-4">
                            {[...Array(6)].map((_, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    className="w-10 h-12 text-center text-lg rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </button>
                    </>
                )}

                {isOtpSubmitted && isEmailSent && (
                    <>
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
                            Set New Password
                        </h2>
                        <form onSubmit={onSubmitNewPassword} className="space-y-4">
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
