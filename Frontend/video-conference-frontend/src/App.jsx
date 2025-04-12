import { useState } from 'react'
import ThemeToggle from './components/ThemeToggle'
import './App.css'
import toast from 'react-hot-toast'
import Home from './pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Home/>
  )
}

export default App
