import React, { useEffect, useState, useContext } from "react";
import UserNavbar from "../../components/common/UserNavbar";
import IncomingRequestCard from "../../components/requests/IncomingRequestCard";
import SentRequestStatus from "../../components/requests/SentRequestStatus";
import { requestService } from "../../services/requestService";
import Toast from "../../components/common/Toast";
import { SocketContext } from "../../context/SocketContext";

// --- Compact Responsive Modal ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60 animate-in fade-in duration-200">
      <div className="bg-[#1a2e21] border border-[#2d4a35] w-full max-w-[340px] sm:max-w-md rounded-2xl p-5 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-3">
            <span className="material-symbols-outlined text-red-500 text-2xl">delete_sweep</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {message}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-[#23372a] transition-all"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95"
          >
            Cancel it
          </button>
        </div>
      </div>
    </div>
  );
};

const Requests = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "info" });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);

  const showToast = (message, type = "info") => {
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
        const r = typeof updatedRequest.toObject === "function"
            ? updatedRequest.toObject()
            : updatedRequest;

        const isRelevant =
          (r.requester?._id?.toString() === currentUser.toString()) ||
          (r.receiver?._id?.toString() === currentUser.toString());

        if (!isRelevant) return;

        setRequests((prev) => {
          const exists = prev.find((p) => p._id === r._id);
          if (exists) {
            return prev.map((p) => (p._id === r._id ? r : p));
          }
          return [r, ...prev];
        });
      } catch (err) {
        console.error("Error handling socket event", err);
      }
    };

    socketCtx.on("requestUpdated", handler);
    return () => socketCtx.off("requestUpdated", handler);
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

  const handleWithdrawClick = (id) => {
    setRequestToCancel(id);
    setIsModalOpen(true);
  };

  const confirmWithdraw = async () => {
    const id = requestToCancel;
    setIsModalOpen(false);
    setRequestToCancel(null);

    const previousRequests = [...requests];
    setRequests((prev) => prev.filter((req) => req._id !== id));

    try {
      const res = await requestService.withdrawRequest(id);
      if (!res.success) {
        setRequests(previousRequests);
        showToast("Could not cancel request.", "error");
      } else {
        showToast("Request cancelled successfully", "success");
      }
    } catch (err) {
      console.error("Withdraw failed", err);
      fetchRequests();
      showToast("Something went wrong.", "error");
    }
  };

  const receivedRequests = requests.filter(
    (r) => r.receiver?._id?.toString() === currentUser?.toString() && r.status !== "cancelled"
  );

  const sentRequests = requests.filter(
    (r) => r.requester?._id?.toString() === currentUser?.toString() && r.status !== "cancelled"
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#112217] text-slate-200 font-['Lexend']">
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-12 max-w-5xl mx-auto w-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Swap <span className="text-[#13ec5b]">Hub</span>
            </h2>
            <p className="text-slate-400 font-medium mt-1 text-sm">
              Manage your swap status
            </p>
          </div>

          <div className="flex gap-2 bg-[#1a2e21] p-1 rounded-xl border border-[#2d4a35]">
            <button
              onClick={() => setActiveTab("received")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex-1 ${
                activeTab === "received" ? "bg-[#13ec5b] text-black shadow-lg" : "text-slate-400 hover:text-white"
              }`}
            >
              Received ({receivedRequests.filter(r => r.status === "pending").length})
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex-1 ${
                activeTab === "sent" ? "bg-[#13ec5b] text-black shadow-lg" : "text-slate-400 hover:text-white"
              }`}
            >
              Sent ({sentRequests.filter(r => r.status === "pending").length})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-[#1a2e21] rounded-2xl border border-[#2d4a35]" />
              ))}
            </div>
          ) : activeTab === "received" ? (
            receivedRequests.length > 0 ? (
              receivedRequests.map((req) => (
                <IncomingRequestCard key={req._id} request={req} refresh={fetchRequests} />
              ))
            ) : (
              <EmptyState message="No incoming requests." />
            )
          ) : sentRequests.length > 0 ? (
            sentRequests.map((req) => (
              <SentRequestStatus
                key={req._id}
                request={req}
                onWithdraw={handleWithdrawClick}
              />
            ))
          ) : (
            <EmptyState message="No sent requests." />
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmWithdraw}
        title="Cancel Request?"
        message="Are you sure? This will permanently remove the request."
      />

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
  <div className="text-center py-12 bg-[#1a2e21] border border-dashed border-[#2d4a35] rounded-2xl flex flex-col items-center justify-center">
    <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">inbox</span>
    <p className="text-slate-500 text-sm">{message}</p>
  </div>
);

export default Requests;