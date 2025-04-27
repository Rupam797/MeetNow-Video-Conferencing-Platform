import React from 'react'
import { Routes,Route } from 'react-router'
import App from '../App'
import Signup from '../auth/Signup'
import Login from '../auth/Login'
import Dashboard from '../pages/Dashboard'
import MeetingLobby from '../pages/MeetingLobby'
import MeetingRoom from '../pages/MeetingRoom'


const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/Signup' element={<Signup/>} />
        <Route path='/Login' element={<Login/>} />
        <Route path='/Dashboard' element={<Dashboard/>} />
        <Route path='/Meetinglobby' element={<MeetingLobby/>} />
        <Route path='/Meetingroom' element={<MeetingRoom/>} />
        
    
       </Routes>
  )
}

export default AppRoutes