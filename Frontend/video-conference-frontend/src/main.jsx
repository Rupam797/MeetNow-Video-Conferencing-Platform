import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter} from 'react-router'
import AppRoutes from './config/Routes.jsx'
import toast, { Toaster } from 'react-hot-toast';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
       <AppRoutes/>
       <Toaster/>
    </BrowserRouter>
  </StrictMode>,
)
