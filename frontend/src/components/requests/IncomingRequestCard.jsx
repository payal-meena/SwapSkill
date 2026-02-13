
import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { requestService } from "../../services/requestService";

import { chatService } from '../../services/chatService';



const IncomingRequestCard = ({ request, refresh }) => {

  const { _id, requester, offeredSkill, requestedSkill, status } = request;

  const navigate = useNavigate();



  // Check karein ki kya ye ID pehle se hidden list mein hai

  const [isVisible, setIsVisible] = useState(() => {

    const hiddenRequests = JSON.parse(localStorage.getItem('hidden_requests') || '[]');

    return !hiddenRequests.includes(_id);

  });


  const handleMessageClick = async () => {
    try {
      const chatPayload = {

        requestId: _id,            // Card ki request ID

        otherUserId: requester._id  // Saamne wale user ki ID

      };


      const res = await chatService.createOrGetChat(chatPayload);

      if (res && res._id) {

        // Hum URL aise banyenge: /messages/USER_ID?requestId=REQ_ID

        navigate(`/messages/${requester._id}`);
      }

    } catch (err) {

      console.error("Chat Error:", err.response?.data || err.message);

      alert(err.response?.data?.message || "Chat start nahi ho payi.");

    }

  };






  const handleAction = async (action) => {

    try {

      if (action === 'accept') {

        await requestService.acceptRequest(_id);

        refresh(); // List refresh hogi status change dikhane ke liye

      }

      else if (action === 'reject' || action === 'remove') {

        // Agar reject kar rahe hain toh pehle backend call karein

        if (action === 'reject') {

          await requestService.rejectRequest(_id);

        }



        // Card ko UI se hatao (Dono cases mein: Reject ya Remove)

        setIsVisible(false);



        // LocalStorage mein save karo taaki refresh par wapas na aaye

        const hiddenRequests = JSON.parse(localStorage.getItem('hidden_requests') || '[]');

        if (!hiddenRequests.includes(_id)) {

          hiddenRequests.push(_id);

          localStorage.setItem('hidden_requests', JSON.stringify(hiddenRequests));

        }



        // Refresh call karo taaki count update ho jaye (Requests tab mein)

        refresh();

      }

    } catch (err) {

      console.error(`${action} failed:`, err);

    }

  };



  if (!isVisible) return null;



  return (

    <div className={`group bg-[#0d120e] border p-5 rounded-[2rem] transition-all duration-300 shadow-xl ${status === 'accepted' ? 'border-[#13ec5b]/40 bg-[#111812]' : 'border-[#1d2e22] hover:border-[#13ec5b]/30'}`}>

      <div className="flex flex-col lg:flex-row lg:items-center gap-6">



        {/* Profile Section */}

        <Link to={`/profile/${requester._id}`} className="flex items-center gap-4 min-w-[250px]">

          <div className="relative">

            {/* Profile Section ke andar image tag ko aise update karein */}

            <img

              src={

                requester?.profileImage

                  ? (requester.profileImage.startsWith('http')

                    ? requester.profileImage

                    : `${API_URL}${requester.profileImage}`)

                  : `https://ui-avatars.com/api/?name=${requester.name}&bg=13ec5b&color=000&bold=true`

              }

              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#1d2e22]"

              alt={requester.name}

              onError={(e) => {

                // Agar image load hone mein error aaye toh avatar dikhao

                e.target.src = `https://ui-avatars.com/api/?name=${requester.name}&bg=13ec5b&color=000&bold=true`;

              }}

            />

            {status === 'accepted' && (

              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#13ec5b] border-4 border-[#0d120e] rounded-full flex items-center justify-center">

                <span className="material-symbols-outlined text-[14px] text-black font-bold">check</span>

              </div>

            )}

          </div>

          <div>

            <h4 className="text-white font-bold text-lg">{requester.name}</h4>

            <p className="text-slate-500 text-[10px] font-bold uppercase">{status}</p>

          </div>

        </Link>



        {/* Skills Section */}

        <div className="flex-1 flex items-center justify-around bg-black/40 p-4 rounded-2xl border border-[#1d2e22]">

          {/* ... skills content (same as before) ... */}

          <p className="text-[#13ec5b] font-bold">Teach</p>

          <span className="material-symbols-outlined text-[#13ec5b]">sync</span>

          <p className="text-white font-bold">Learn</p>

        </div>



        {/* Buttons */}

        {/* <div className="flex gap-3 items-center">

          {status === 'pending' ? (

            <>

              <button onClick={() => handleAction('accept')} className="px-8 py-3 bg-[#13ec5b] text-black font-black rounded-xl">Accept</button>

              <button onClick={() => handleAction('reject')} className="px-8 py-3 border border-[#1d2e22] text-slate-400 rounded-xl">Decline</button>

            </>

          ) : (

            <>

              <button onClick={handleMessageClick} className="flex items-center gap-2 px-8 py-3 bg-[#0070f3] text-white font-bold rounded-xl">

                <span className="material-symbols-outlined text-sm">send</span> Message

              </button>

              <button

                onClick={() => handleAction('remove')}

                className="w-12 h-12 flex items-center justify-center bg-[#1a1a1a] border border-[#2d2d2d] text-slate-500 hover:text-red-500 rounded-xl"

              >

                <span className="material-symbols-outlined">close</span>

              </button>

            </>

          )}

        </div> */}
        {/* Buttons Section */}
        {/* Buttons Section */}
        <div className="flex gap-3 items-center">
          {/* CASE 1: PENDING - Neon Green for Accept */}
          {status === 'pending' && (
            <>
              <button
                onClick={() => handleAction('accept')}
                className="px-8 py-3 bg-[#13ec5b] text-[#102216] font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(19,236,91,0.2)]"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction('reject')}
                className="px-8 py-3 border border-[#23482f] text-[#92c9a4] font-bold rounded-2xl hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all"
              >
                Decline
              </button>
            </>
          )}

          {/* CASE 2: ACCEPTED - Theme Green but with Glassy/Deep look */}
          {status === 'accepted' && (
            <>
              <button
                onClick={handleMessageClick}
                className="flex items-center gap-2 px-8 py-3 bg-[#193322] border border-[#13ec5b]/40 text-[#13ec5b] font-bold rounded-2xl hover:bg-[#13ec5b] hover:text-[#102216] transition-all group"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                Message
              </button>
              <button
                onClick={() => handleAction('remove')}
                className="w-12 h-12 flex items-center justify-center bg-[#112217] border border-[#23482f] text-[#92c9a4] hover:text-red-500 hover:border-red-500/50 rounded-2xl transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </>
          )}

          {/* CASE 3: REJECTED - Subtle Dark Theme */}
          {status === 'rejected' && (
            <button
              onClick={() => handleAction('remove')}
              className="px-6 py-3 bg-[#111812] border border-red-900/30 text-slate-500 font-bold rounded-2xl hover:border-red-500/50 hover:text-red-500 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Remove Rejected
            </button>
          )}
        </div>

      </div>

    </div>

  );

};



export default IncomingRequestCard; 