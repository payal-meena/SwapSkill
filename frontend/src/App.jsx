import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { NotificationProvider } from './context/NotificationContext'
import SocketProvider from './context/SocketContext'


function App() {
  return (
    <BrowserRouter>
    <SocketProvider>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App
