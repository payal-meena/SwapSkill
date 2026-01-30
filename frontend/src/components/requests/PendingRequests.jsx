
import React, { useEffect, useState } from 'react';
import { requestService } from '../../services/requestService';

const RequestItem = ({ name, skill, message, img, onAccept, onDecline }) => (
  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#193322] border border-slate-100 dark:border-[#23482f]">
    <div className="flex gap-3 mb-3">
      <img className="h-10 w-10 rounded-lg object-cover" src={img} alt={name} />
      <div>
        <p className="text-slate-900 dark:text-white text-sm font-bold">{name}</p>
        <p className="text-slate-500 dark:text-[#92c9a4] text-xs">
          wants to learn <span className="text-[#13ec5b] font-medium">{skill}</span>
        </p>
      </div>
    </div>
    {message && <p className="text-slate-600 dark:text-slate-400 text-xs italic mb-4">"{message}"</p>}
    <div className="grid grid-cols-2 gap-2">
      <button 
        onClick={onAccept}
        className="py-1.5 rounded-lg bg-[#13ec5b] text-black text-xs font-bold hover:opacity-90 transition-all"
      >
        Accept
      </button>
      <button 
        onClick={onDecline}
        className="py-1.5 rounded-lg border border-slate-200 dark:border-[#326744] text-slate-500 text-xs font-medium hover:text-red-500 hover:border-red-500/50 transition-all"
      >
        Decline
      </button>
    </div>
  </div>
);

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingData = async () => {
    try {
      setLoading(true);
      const res = await requestService.getMyRequests();
      const allRequests = res.requests || [];
      const currentUserId = res.currentUser;

      // Logic: Sirf wo requests jo AAPKO mili hain aur status PENDING hai
      const incomingPending = allRequests.filter(req => 
        req.receiver?._id === currentUserId && req.status === 'pending'
      );

      setRequests(incomingPending);
    } catch (err) {
      console.error("Error loading pending requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, []);
  const handleAction = async (id, action) => {
  try {
    if (action === 'accept') {
      await requestService.acceptRequest(id);
    } else {
     
      await requestService.rejectRequest(id);
    }

    setRequests(prev => prev.filter(req => req._id !== id));
    
    fetchPendingData();

  } catch (err) {
    console.error(`Error during ${action}:`, err);
    alert(err.response?.data?.message || `Failed to ${action} request.`);
  }
};


  

  if (loading) return <div className="p-6 animate-pulse bg-white dark:bg-[#112217] rounded-2xl border border-[#23482f] h-40" />;

  return (
    <div className="bg-white dark:bg-[#112217] rounded-2xl border border-slate-200 dark:border-[#23482f] p-6 shadow-sm">
      <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
        Pending Requests 
        {requests.length > 0 && (
          <span className="bg-[#13ec5b] text-black text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-black">
            {requests.length}
          </span>
        )}
      </h2>
      
      <div className="flex flex-col gap-4">
        {requests.length > 0 ? (
          requests.map((req) => (
            <RequestItem 
              key={req._id}
              name={req.requester?.name}
              skill={req.skillName || "a Skill"} // Backend se skill name bhejna zaroori hai
              message={req.note}
              img={req.requester?.profileImage || `https://ui-avatars.com/api/?name=${req.requester?.name}&bg=13ec5b&color=000`}
              onAccept={() => handleAction(req._id, 'accept')}
              onDecline={() => handleAction(req._id, 'decline')}
            />
          ))
        ) : (
          <p className="text-slate-500 text-xs text-center py-4">No new requests to show.</p>
        )}
      </div>
    </div>
  );
};

export default PendingRequests;