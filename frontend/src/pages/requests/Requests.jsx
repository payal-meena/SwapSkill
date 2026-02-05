import React, { useEffect, useState, useContext } from "react";
import UserNavbar from "../../components/common/UserNavbar";
import IncomingRequestCard from "../../components/requests/IncomingRequestCard";
import SentRequestStatus from "../../components/requests/SentRequestStatus";
import { requestService } from "../../services/requestService";
import Toast from "../../components/common/Toast";
import { SocketContext } from "../../context/SocketContext";

const Requests = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const socketCtx = useContext(SocketContext);

  useEffect(() => {
    if (!socketCtx || !socketCtx.on || !currentUser) return;

    const handler = (updatedRequest) => {
      try {
        // Ensure populated objects exist
        const r = typeof updatedRequest.toObject === 'function' ? updatedRequest.toObject() : updatedRequest;

        const isRelevant = (r.requester && r.requester._id && r.requester._id.toString() === currentUser.toString()) ||
                           (r.receiver && r.receiver._id && r.receiver._id.toString() === currentUser.toString());

        if (!isRelevant) return;

        setRequests(prev => {
          const exists = prev.find(p => p._id === r._id);
          if (exists) {
            return prev.map(p => p._id === r._id ? r : p);
          }
          // new request, prepend
          return [r, ...prev];
        });
      } catch (err) {
        console.error('Error handling requestUpdated socket event', err);
      }
    };

    socketCtx.on('requestUpdated', handler);

    return () => {
      socketCtx.off('requestUpdated', handler);
    };
  }, [socketCtx, currentUser]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await requestService.getMyRequests();
      setRequests(res.requests || []);
      setCurrentUser(res.currentUser);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;

    const previousRequests = [...requests];
    setRequests(prev => prev.filter(req => req._id !== id));
    try {
      const res = await requestService.withdrawRequest(id);
      if (!res.success) {
        setRequests(previousRequests);
        showToast("Could not cancel request.", 'error');
      } else {
        showToast("Request cancelled successfully", 'success');
      }
    } catch (err) {
      console.error("Withdraw failed", err);
      fetchRequests();
      showToast("Something went wrong. Please try again.", 'error');
    }
  };

  const receivedRequests = requests.filter((r) => 
    r.receiver?._id?.toString() === currentUser?.toString() && 
    r.status !== 'cancelled' 
  );

  const sentRequests = requests.filter((r) => 
    r.requester?._id?.toString() === currentUser?.toString() && 
    r.status !== 'cancelled' 
  );

  return (
    /* Background updated to rgb(17, 34, 23) */
    <div className="min-h-screen flex flex-col bg-[#112217] text-slate-200 font-['Lexend']">
     
      <main className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">
              Swap <span className="text-[#13ec5b]">Hub</span>
            </h2>
            <p className="text-slate-400 font-medium mt-1">Manage your incoming and outgoing requests</p>
          </div>
          
          {/* Tab Container color lightened slightly for contrast */}
          <div className="flex gap-2 bg-[#1a2e21] p-1 rounded-xl border border-[#2d4a35]">
            <button 
              onClick={() => setActiveTab("received")} 
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "received" ? "bg-[#13ec5b] text-black shadow-lg" : "text-slate-400 hover:text-white"}`}
            >
              Received ({receivedRequests.filter(r => r.status === 'pending').length})
            </button>
            <button 
              onClick={() => setActiveTab("sent")} 
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "sent" ? "bg-[#13ec5b] text-black shadow-lg" : "text-slate-400 hover:text-white"}`}
            >
              Sent ({sentRequests.filter(r => r.status === 'pending').length})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                /* Skeleton updated */
                <div key={i} className="h-32 bg-[#1a2e21] rounded-3xl border border-[#2d4a35]" />
              ))}
            </div>
          ) : activeTab === "received" ? (
            receivedRequests.length > 0 ? (
              receivedRequests.map((req) => (
                <IncomingRequestCard key={req._id} request={req} refresh={fetchRequests} />
              ))
            ) : <EmptyState message="No incoming requests yet." />
          ) : (
            sentRequests.length > 0 ? (
              sentRequests.map((req) => (
                <SentRequestStatus key={req._id} request={req} onWithdraw={handleWithdraw} />
              ))
            ) : <EmptyState message="You haven't sent any requests." />
          )}
        </div>
      </main>
      
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

const EmptyState = ({ message }) => (
  /* Empty state box colors updated to match theme */
  <div className="text-center py-20 bg-[#1a2e21] border border-dashed border-[#2d4a35] rounded-[3rem] flex flex-col items-center">
    <span className="material-symbols-outlined text-5xl text-slate-500 mb-4">inbox</span>
    <p className="text-slate-400 font-medium">{message}</p>
  </div>
);

export default Requests;