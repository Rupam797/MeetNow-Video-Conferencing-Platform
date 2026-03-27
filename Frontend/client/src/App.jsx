import './App.css'
import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from './pages/Dashboard.jsx';
import MeetingLobby from './pages/MeetingLobby.jsx';
import MeetingRoom from './pages/MeetingRoom.jsx';


const App = () => {
    return (
        <div>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/email-verify" element={<EmailVerify />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path='/Dashboard' element={<Dashboard/>} />
                <Route path='/join/:meetingCode' element={<Dashboard/>} />
                <Route path='/Meetinglobby/:meetingCode' element={<MeetingLobby/>} />
                <Route path='/Meetingroom/:meetingCode' element={<MeetingRoom/>} />
            </Routes>
        </div>
    )
}

export default App
