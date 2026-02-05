import React, { createContext, useMemo } from 'react';
import { useSocket } from '../hooks/useSocket';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useSocket();

  const helpers = useMemo(() => {
    if (!socket) return { socket: null, on: () => {}, off: () => {} };

    return {
      socket,
      on: (event, handler) => socket.on(event, handler),
      off: (event, handler) => socket.off(event, handler),
      emit: (event, payload) => socket.emit(event, payload),
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={helpers}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
