
import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { chatService } from '../../services/chatService';

const SentRequestStatus = ({ request, onWithdraw }) => {
  const { receiver, status ,_id,requester} = request;
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  if (status === 'rejected' || status === 'cancelled') {
    return null;
  }
    const navigate= useNavigate();


  const steps = ["Requested", "Accepted", "Workspace"];
  const progressStep = status === 'pending' ? 0 : status === 'accepted' ? 1 : 2;
  const isAccepted = status === 'accepted' || status === 'completed';

  const handleWithdrawClick = async () => {
    try {
      setIsWithdrawing(true);
      await onWithdraw(request._id);
    } catch (err) {
      console.error("Withdrawal error:", err);
    } finally {
      setIsWithdrawing(false);
    }
  };
  const handleMessageClick = async () => {

    try {

      // 1. Payload banao (Dhyan do: requestId aur otherUserId dono bhej rahe hain)

      const chatPayload = {

        requestId: _id,            // Card ki request ID

        otherUserId: requester._id  // Saamne wale user ki ID

      };



      console.log("Creating/Fetching Chat with payload:", chatPayload);



      // 2. Service call (Ab backend ko requestId mil jayegi)

      const res = await chatService.createOrGetChat(chatPayload);

      // 3. Navigate karte waqt URL mein requestId bhi pass karo

      if (res && res._id) {
        navigate(`/messages/${requester._id}?requestId=${_id}`, {

          state: {
            chatId: res._id,
            userName: requester.name,
            userImage: requester.profileImage
          }

        });

      }

    } catch (err) {

      console.error("Chat Error:", err.response?.data || err.message);

      alert(err.response?.data?.message || "Chat start nahi ho payi.");

    }

  };

  return (
    <div className="group bg-[#0d120e] border border-[#1d2e22] p-6 rounded-[2.5rem] transition-all duration-300 shadow-2xl">
      <div className="flex flex-col lg:flex-row items-center gap-8">

        {/* Profile Section */}
        <Link to={`/profile/${receiver?._id}`} className="flex items-center gap-5 min-w-[260px] group/user cursor-pointer">
          <div className="relative">
            <img
              className={`h-16 w-16 rounded-2xl object-cover border-2 transition-all ${isAccepted ? 'border-[#13ec5b]' : 'border-slate-700'}`}
              src={receiver?.profileImage || `https://ui-avatars.com/api/?name=${receiver?.name}&bg=13ec5b&color=000&bold=true`}
              alt={receiver?.name}
            />
          </div>
          <div>
            <h3 className="font-black text-xl text-white group-hover/user:text-[#13ec5b] transition-colors">{receiver?.name}</h3>
            <span className="text-[#13ec5b] text-[10px] font-black uppercase tracking-widest">View Profile</span>
          </div>
        </Link>

        {/* Stepper (Middle) */}
        <div className="flex-1 flex items-center w-full px-4">
          {steps.map((step, idx) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center relative">
                <div className={`w-3.5 h-3.5 rounded-full z-10 ${idx <= progressStep ? 'bg-[#13ec5b] shadow-[0_0_15px_rgba(19,236,91,0.4)]' : 'bg-[#1d2e22]'}`} />
                <span className={`absolute -bottom-6 text-[9px] font-black uppercase whitespace-nowrap ${idx <= progressStep ? 'text-[#13ec5b]' : 'text-slate-600'}`}>{step}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-4 bg-[#1d2e22]">
                  <div className="h-full bg-[#13ec5b] transition-all duration-1000" style={{ width: idx < progressStep ? '100%' : '0%' }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Action Button */}
        <div className="w-full lg:w-auto">
          {isAccepted ? (
            <button onClick={handleMessageClick}
             className="block text-center lg:px-8 py-3.5 bg-[#13ec5b] text-black text-xs font-black rounded-2xl uppercase tracking-widest">
          Start Swapping
            </button>
          ) : (
          <button
            onClick={handleWithdrawClick}
            disabled={isWithdrawing}
            className={`w-full lg:px-8 py-3.5 border border-[#1d2e22] text-xs font-bold rounded-2xl transition-all uppercase tracking-widest 
                ${isWithdrawing ? 'opacity-50' : 'hover:text-red-500 hover:border-red-500/50 text-slate-500'}`}
          >
            {isWithdrawing ? 'Stopping...' : 'Cancel Request'}
          </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentRequestStatus;