
import React, { useEffect, useState } from "react";
import UserNavbar from "../../components/common/UserNavbar";
import IncomingRequestCard from "../../components/requests/IncomingRequestCard";
import SentRequestStatus from "../../components/requests/SentRequestStatus";
import { requestService } from "../../services/requestService";

const Requests = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await requestService.getMyRequests();
      // Backend se jo data aa raha hai usey state mein save karo
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
      // 1. Optimistic Update: Pehle UI se hata do taaki user ko wait na karna pade

      // 2. Backend Call
      const res = await requestService.withdrawRequest(id);
      
      if (!res.success) {
        
        setRequests(previousRequests);
        alert("Could not cancel request.");
      }
    } catch (err) {
      console.error("Withdraw failed", err);
      fetchRequests(); // Error aane par refresh karlo list
      alert("Something went wrong. Please try again.");
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
    <div className="min-h-screen flex flex-col bg-[#050806] text-slate-200 font-['Lexend']">
      <UserNavbar userName="Alex" />
      <main className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">
              Swap <span className="text-[#13ec5b]">Hub</span>
            </h2>
            <p className="text-slate-500 font-medium mt-1">Manage your incoming and outgoing requests</p>
          </div>
          <div className="flex gap-2 bg-[#0d120e] p-1 rounded-xl border border-[#1d2e22]">
            <button 
              onClick={() => setActiveTab("received")} 
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "received" ? "bg-[#13ec5b] text-black shadow-lg" : "text-slate-500 hover:text-white"}`}
            >
              Received ({receivedRequests.filter(r => r.status === 'pending').length})
            </button>
            <button 
              onClick={() => setActiveTab("sent")} 
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "sent" ? "bg-[#13ec5b] text-black shadow-lg" : "text-slate-500 hover:text-white"}`}
            >
              Sent ({sentRequests.filter(r => r.status === 'pending').length})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-[#0d120e] rounded-3xl border border-[#1d2e22]" />)}
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
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="text-center py-20 bg-[#0d120e] border border-dashed border-[#1d2e22] rounded-[3rem] flex flex-col items-center">
    <span className="material-symbols-outlined text-5xl text-slate-700 mb-4">inbox</span>
    <p className="text-slate-400 font-medium">{message}</p>
  </div>
);

export default Requests;