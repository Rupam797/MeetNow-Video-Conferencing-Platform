import React from 'react'
import { Routes,Route } from 'react-router'
import App from '../App'
import Signup from '../auth/Signup'
import Login from '../auth/Login'
import Dashboard from '../pages/Dashboard'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/Signup' element={<Signup/>} />
        <Route path='/Login' element={<Login/>} />
        <Route path='/Dashboard' element={<Dashboard/>} />
        
        <Route path='/about' element={<h1>This is chat about</h1>} />
       </Routes>
  )
}

export default AppRoutes