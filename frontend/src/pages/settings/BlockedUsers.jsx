import React, { useEffect, useState } from 'react';
import { blockService } from '../../services/blockService';
import UserNavbar from '../../components/common/UserNavbar';
import Toast from '../../components/common/Toast';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlockedUsers = () => {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

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

  const handleUnblock = async (userId) => {
    if (!window.confirm('Are you sure you want to unblock this user?')) return;

    try {
      await blockService.unblockUser(userId);
      setBlockedUsers(prev => prev.filter(u => u._id !== userId));
      showToast('User unblocked successfully', 'success');
    } catch (error) {
      console.error('Error unblocking user:', error);
      showToast(error.response?.data?.message || 'Failed to unblock user', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#112217] text-slate-200 font-['Lexend']">
      
      <main className="flex-1 p-4 md:p-10 max-w-4xl mx-auto w-full">
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-[#13ec5b] hover:brightness-125 flex items-center gap-2 transition-all font-black text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-black text-white tracking-tight">
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
                className="bg-[#0d120e] border border-[#1d2e22] p-5 rounded-2xl flex items-center justify-between hover:border-[#13ec5b]/30 transition-all shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      user.profileImage && user.profileImage.startsWith('http')
                        ? user.profileImage
                        : user.profileImage
                          ? `${user.profileImage}`
                          : `https://ui-avatars.com/api/?name=${user.name}&bg=13ec5b&color=000&bold=true`
                    }
                    className="w-14 h-14 rounded-full border-2 border-[#1d2e22] object-cover"
                    alt={user.name}
                  />
                  <div>
                    <h3 className="font-bold text-white text-lg">{user.name}</h3>
                    <p className="text-slate-500 text-sm">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleUnblock(user._id)}
                  className="px-6 py-2.5 bg-[#13ec5b] text-[#05160e] font-black rounded-xl hover:bg-[#13ec5b]/90 transition-all active:scale-95"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1a2e21] border border-dashed border-[#2d4a35] rounded-[2rem] flex flex-col items-center">
            <span className="material-symbols-outlined text-5xl text-slate-500 mb-4">shield</span>
            <p className="text-slate-400 font-medium">No blocked users yet</p>
            <p className="text-slate-500 text-sm mt-2">Users you block will appear here</p>
          </div>
        )}
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

export default BlockedUsers;
