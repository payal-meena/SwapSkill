import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { NotificationProvider } from './context/NotificationContext'


function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App
