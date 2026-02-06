import React, { useEffect, useState } from 'react';
import { blockService } from '../../services/blockService';
import UserNavbar from '../../components/common/UserNavbar';
import Toast from '../../components/common/Toast';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Custom Confirmation Modal Component ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-[#0d120e] border border-[#13ec5b]/20 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">person_remove</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Unblock User?</h2>
          <p className="text-slate-400 mb-8">
            Are you sure you want to unblock <span className="text-white font-bold">{userName}</span>? They will be able to contact you again.
          </p>
          
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-4 bg-[#13ec5b] text-[#05160e] font-black rounded-2xl hover:brightness-110 transition-all active:scale-95"
            >
              YES, UNBLOCK
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 bg-white/5 text-slate-300 font-bold rounded-2xl hover:bg-white/10 transition-all"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlockedUsers = () => {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });
  
  // Modal State
  const [modal, setModal] = useState({ isOpen: false, userId: null, userName: '' });

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const res = await blockService.getBlockedUsers();
      setBlockedUsers(res.blockedUsers || []);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      showToast('Failed to load blocked users', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Jab unblock button click ho
  const openConfirmModal = (user) => {
    setModal({ isOpen: true, userId: user._id, userName: user.name });
  };

  const handleUnblock = async () => {
    const userId = modal.userId;
    try {
      await blockService.unblockUser(userId);
      setBlockedUsers(prev => prev.filter(u => u._id !== userId));
      showToast('User unblocked successfully', 'success');
    } catch (error) {
      console.error('Error unblocking user:', error);
      showToast(error.response?.data?.message || 'Failed to unblock user', 'error');
    } finally {
      setModal({ isOpen: false, userId: null, userName: '' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#112217] text-slate-200 font-['Lexend']">
      
      <main className="flex-1 p-4 md:p-10 max-w-4xl mx-auto w-full">
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-[#13ec5b] hover:brightness-125 flex items-center gap-2 transition-all font-black text-sm uppercase tracking-widest group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Blocked <span className="text-[#13ec5b]">Users</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2">Manage your blocked users list</p>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-[#1a2e21] rounded-2xl border border-[#2d4a35]" />
            ))}
          </div>
        ) : blockedUsers.length > 0 ? (
          <div className="space-y-4">
            {blockedUsers.map((user) => (
              <div
                key={user._id}
                className="group bg-[#0d120e] border border-[#1d2e22] p-5 rounded-[2rem] flex items-center justify-between hover:border-[#13ec5b]/30 transition-all shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      user.profileImage && user.profileImage.startsWith('http')
                        ? user.profileImage
                        : `https://ui-avatars.com/api/?name=${user.name}&bg=13ec5b&color=000&bold=true`
                    }
                    className="w-14 h-14 rounded-full border-2 border-[#1d2e22] group-hover:border-[#13ec5b]/50 transition-all object-cover"
                    alt={user.name}
                  />
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{user.name}</h3>
                    <p className="text-slate-500 text-sm">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => openConfirmModal(user)}
                  className="px-6 py-3 bg-[#13ec5b]/10 text-[#13ec5b] border border-[#13ec5b]/20 font-black rounded-xl hover:bg-[#13ec5b] hover:text-[#05160e] transition-all active:scale-95 shadow-sm"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1a2e21]/30 border-2 border-dashed border-[#2d4a35] rounded-[3rem] flex flex-col items-center">
            <div className="w-20 h-20 bg-[#13ec5b]/5 rounded-full flex items-center justify-center mb-4">
               <span className="material-symbols-outlined text-5xl text-[#13ec5b]/40">shield</span>
            </div>
            <p className="text-white text-xl font-bold">Your list is clean</p>
            <p className="text-slate-500 text-sm mt-2 max-w-xs">Users you block to restrict communication will appear here.</p>
          </div>
        )}
      </main>

      {/* Pop-up Modal */}
      <ConfirmModal
        isOpen={modal.isOpen}
        userName={modal.userName}
        onClose={() => setModal({ isOpen: false, userId: null, userName: '' })}
        onConfirm={handleUnblock}
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

export default BlockedUsers;