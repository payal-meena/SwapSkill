// import React, { createContext, useMemo, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// export const SocketContext = createContext(null);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [myUserId, setMyUserId] = useState(null);

//   // 🔹 Extract userId from JWT token
//   const getMyIdFromToken = () => {
//     const token = localStorage.getItem('token');
//     if (!token) return null;
//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const payload = JSON.parse(window.atob(base64));
//       return payload.id || payload._id;
//     } catch (e) { return null; }
//   };

//   useEffect(() => {
//     const userId = getMyIdFromToken();
//     if (!userId) return;
//     setMyUserId(userId);

//     const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
//       query: { userId },
//     });

//     setSocket(newSocket);

//     // Cleanup on unmount
//     return () => newSocket.disconnect();
//   }, []);

//   // 🔹 Helpers for easy use
//   const helpers = useMemo(() => {
//     if (!socket) return { socket: null, on: () => {}, off: () => {}, emit: () => {}, myUserId };

//     return {
//       socket,
//       on: (event, handler) => socket.on(event, handler),
//       off: (event, handler) => socket.off(event, handler),
//       emit: (event, payload) => socket.emit(event, payload),
//       myUserId
//     };
//   }, [socket, myUserId]);

//   return (
//     <SocketContext.Provider value={helpers}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export default SocketProvider;
// SocketContext.jsx (Full updated code with production improvements)
// No lines removed

import React, { createContext, useMemo, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [myUserId, setMyUserId] = useState(null);

  // 🔹 Extract userId from JWT token
  const getMyIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload.id || payload._id;
    } catch (e) { return null; }
  };

  useEffect(() => {
    const userId = getMyIdFromToken();
    if (!userId) {
      console.log("[SocketProvider] ❌ No userId found from token");
      return;
    }
    console.log("[SocketProvider] 🔑 userId from token:", userId);
    setMyUserId(userId);
    
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      query: { userId },
      
    });
    
    newSocket.on('connect', () => {
      console.log("[SocketProvider] ✅ Socket connected!", newSocket.id);
    });
    
    newSocket.on('disconnect', () => {
      console.log("[SocketProvider] ❌ Socket disconnected!");
    });
    
    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      console.log("[SocketProvider] 🧹 Cleaning up socket");
      newSocket.disconnect();
    };
  }, []);

  // 🔹 Helpers for easy use
  const helpers = useMemo(() => {
    if (!socket) return { socket: null, on: () => {}, off: () => {}, emit: () => {}, myUserId };
    return {
      socket,
      on: (event, handler) => socket.on(event, handler),
      off: (event, handler) => socket.off(event, handler),
      emit: (event, payload) => socket.emit(event, payload),
      myUserId
    };
  }, [socket, myUserId]);

  return (
    <SocketContext.Provider value={helpers}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;