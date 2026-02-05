import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

const NotificationModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    console.log("=== MARK ALL READ BUTTON CLICKED ===");
    setLoading(true);
    try {
      await markAllAsRead();
      console.log("Mark all as read completed");
    } catch (error) {
      console.error("Error in handleMarkAllRead:", error);
    }
    setLoading(false);
  };

  const handleMarkSingleRead = async (id) => {
    await markAsRead(id);
  };

  const removeNotification = async (id) => {
    console.log('Deleting notification:', id);
    await deleteNotification(id);
  };

  const handleAction = (id, action) => {
    console.log(`Notification ${id}: ${action}`);
    removeNotification(id);
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      <div className="absolute right-0 mt-3 w-96 bg-[#1a1c1ae6] backdrop-blur-xl rounded-2xl shadow-2xl z-50 overflow-hidden border border-[#13ec5b33] font-['Lexend'] animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
        
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-base">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-[#13ec5b] text-[#102216] text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <button 
            onClick={handleMarkAllRead}
            className="text-[#13ec5b] text-xs font-semibold hover:text-[#13ec5bce] transition-colors cursor-pointer"
          >
            Mark all as read
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-10 text-center text-white/40 text-sm">
              <span className="material-symbols-outlined text-4xl mb-2 block animate-spin">refresh</span>
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-10 text-center text-white/40 text-sm">
              <span className="material-symbols-outlined text-4xl mb-2 block">notifications_off</span>
              No new notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif._id} 
                onClick={() => handleMarkSingleRead(notif._id)}
                className={`px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors relative cursor-pointer group ${!notif.isRead ? 'bg-[#13ec5b]/5' : ''}`}
              >
                {!notif.isRead && (
                  <div className="absolute right-5 top-5 h-2 w-2 rounded-full bg-[#13ec5b] shadow-[0_0_8px_rgba(19,236,91,0.6)]"></div>
                )}

                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    {notif.sender?.profilePicture ? (
                      <img alt={notif.sender?.name} className="h-10 w-10 rounded-lg object-cover border border-white/10" src={notif.sender.profilePicture} />
                    ) : (
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#13ec5b33] text-[#13ec5b]">
                        <span className="material-symbols-outlined">notifications</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[#13ec5b] text-[10px] font-bold uppercase tracking-wider">{notif.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-[10px]">{new Date(notif.createdAt).toLocaleString()}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeNotification(notif._id); }}
                          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-white text-sm font-medium mb-1 leading-snug">
                      {notif.sender?.name && <span className="text-white mr-1">{notif.sender.name}</span>}
                      <span className="text-white/60 font-normal">{notif.message}</span>
                    </p>
                    
                    {notif.type === 'request' && (
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAction(notif._id, 'Accepted'); }}
                          className="flex-1 bg-[#13ec5b] text-[#102216] text-xs font-bold py-1.5 rounded-lg hover:bg-[#13ec5be6] transition-all cursor-pointer"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAction(notif._id, 'Declined'); }}
                          className="flex-1 bg-white/10 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    
                    {notif.type === 'message' && (
                      <div className="mt-3">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (notif.senderId || notif.sender?._id) {
                              const userId = notif.senderId || notif.sender._id;
                              navigate(`/messages/${userId}`, { 
                                state: { scrollToMessageId: notif.relatedId }
                              });
                              onClose();
                            }
                          }}
                          className="w-full border border-[#13ec5b4d] text-[#13ec5b] text-xs font-bold py-1.5 rounded-lg hover:bg-[#13ec5b1a] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">reply</span> Reply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <footer className="bg-white/5 border-t border-white/10">
          <a className="block text-center py-4 text-white/60 text-xs font-bold hover:text-[#13ec5b] transition-all uppercase tracking-widest" href="#">
            View All Notifications
          </a>
        </footer>
      </div>
    </>
  );
};

export default NotificationModal;