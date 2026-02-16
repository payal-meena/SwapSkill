import { createContext, useContext, useState, useEffect } from 'react';
import { requestService } from '../services/requestService';
import { SocketContext } from './SocketContext';

export const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const socketContextValue = useContext(SocketContext);
  
  console.log("[RequestProvider] SocketContext value:", socketContextValue);
  
  // Extract socket - SocketContext returns an object with socket property
  const socket = socketContextValue?.socket;
  
  console.log("[RequestProvider] Socket extracted:", !!socket, socket?.id || 'NO ID');

  // Initial count load + Interval for real-time refresh
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const res = await requestService.getMyRequests();
        const initialCount = res.count || 0;
        setPendingCount(initialCount);
        console.log("[RequestContext] INIT: pendingCount set to", initialCount);
      } catch (err) {
        console.error("[RequestContext] INIT FAILED:", err);
      }
    };
    loadInitial();

    // Interval-based refresh as fallback (every 10 seconds)
    const intervalId = setInterval(() => {
      loadInitial();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Real-time socket listeners
  useEffect(() => {
    console.log("[RequestContext] Socket effect triggered. Socket:", !!socket);
    
    if (!socket) {
      console.log("[RequestContext] ⚠️  Socket not available yet");
      return;
    }

    console.log("[RequestContext] ✅ Socket connected! Setting up listeners");

    // Handler for request updates
    const handleRequestUpdated = (data) => {
      console.log("[RequestContext] 📨 requestUpdated event:", data);
      if (typeof data?.totalPending === 'number') {
        setPendingCount(data.totalPending);
        console.log("[RequestContext] ✅ Count updated to:", data.totalPending);
      }
    };

    // Handler for new incoming requests
    const handleNewIncomingRequest = (data) => {
      console.log("[RequestContext] 📨 newIncomingRequest event:", data);
      setPendingCount(prev => {
        const newCount = prev + 1;
        console.log("[RequestContext] ✅ Incremented to:", newCount);
        return newCount;
      });
    };

    // Handler for request seen
    const handleRequestSeen = (data) => {
      console.log("[RequestContext] 📨 requestSeen event:", data);
      if (typeof data?.totalPending === 'number') {
        setPendingCount(data.totalPending);
        console.log("[RequestContext] ✅ Count set to:", data.totalPending);
      }
    };

    // Attach listeners
    socket.on('requestUpdated', handleRequestUpdated);
    socket.on('newIncomingRequest', handleNewIncomingRequest);
    socket.on('requestSeen', handleRequestSeen);
    
    console.log("[RequestContext] ✅ All listeners attached");

    // Cleanup
    return () => {
      console.log("[RequestContext] 🧹 Cleaning up listeners");
      socket.off('requestUpdated', handleRequestUpdated);
      socket.off('newIncomingRequest', handleNewIncomingRequest);
      socket.off('requestSeen', handleRequestSeen);
    };
  }, [socket]);

  const markAsSeen = async () => {
    try {
      console.log("[RequestContext] Calling markRequestsAsSeen...");
      await requestService.markRequestsAsSeen();
      setPendingCount(0);
      console.log("[RequestContext] ✅ Count reset to 0");
    } catch (err) {
      console.error("[RequestContext] ❌ markAsSeen failed:", err);
    }
  };

  return (
    <RequestContext.Provider value={{ pendingCount, setPendingCount, markAsSeen }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequests = () => useContext(RequestContext);