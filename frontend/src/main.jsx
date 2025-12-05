import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider'
// REMOVED: BrowserRouter, Routes, Route imports (App.jsx handles this)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* We wrap App with AuthProvider so 'login' is available.
      We DO NOT wrap with BrowserRouter because your App.jsx already has one.
    */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)