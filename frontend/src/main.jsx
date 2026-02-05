import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SocketProvider from './context/SocketContext'
import { ChatProvider } from './context/ChatContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </SocketProvider>
  </StrictMode>,
)
