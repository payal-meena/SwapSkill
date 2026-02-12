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
      
      <div className="fixed sm:absolute left-2 right-2 top-14 sm:right-0 sm:left-auto sm:top-auto sm:mt-3 sm:w-96 lg:w-[420px] max-w-md bg-[#1a1c1ae6] backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl z-50 overflow-hidden border border-[#13ec5b33] font-['Lexend'] animate-in fade-in slide-in-from-top-2 duration-200 origin-top scrollbar-hide">
        
        <div className="px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 lg:py-4 flex items-center justify-between border-b border-white/10 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <h3 className="text-white font-bold text-xs sm:text-sm lg:text-base truncate">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-[#13ec5b] text-[#102216] text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                {unreadCount}
              </span>
            )}
          </div>
          <button 
            onClick={handleMarkAllRead}
            className="text-[#13ec5b] text-[9px] sm:text-[10px] lg:text-xs font-semibold hover:text-[#13ec5bce] transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            <span className="hidden sm:inline">Mark all read</span>
            <span className="sm:hidden">Mark read</span>
          </button>
        </div>

        <div className="max-h-[calc(100vh-180px)] sm:max-h-[420px] lg:max-h-[480px] overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="p-6 sm:p-8 lg:p-10 text-center text-white/40 text-xs sm:text-sm">
              <span className="material-symbols-outlined text-2xl sm:text-3xl lg:text-4xl mb-2 block animate-spin">refresh</span>
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 sm:p-8 lg:p-10 text-center text-white/40 text-xs sm:text-sm">
              <span className="material-symbols-outlined text-2xl sm:text-3xl lg:text-4xl mb-2 block">notifications_off</span>
              No new notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif._id} 
                onClick={() => handleMarkSingleRead(notif._id)}
                className={`px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 lg:py-4 border-b border-white/5 hover:bg-white/5 transition-colors relative cursor-pointer group ${!notif.isRead ? 'bg-[#13ec5b]/5' : ''}`}
              >
                {!notif.isRead && (
                  <div className="absolute right-3 sm:right-4 lg:right-5 top-3 sm:top-4 lg:top-5 h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-[#13ec5b] shadow-[0_0_6px_rgba(19,236,91,0.6)] sm:shadow-[0_0_8px_rgba(19,236,91,0.6)]"></div>
                )}

                <div className="flex gap-2 sm:gap-2.5 lg:gap-3">
                  <div className="flex-shrink-0">
                    {notif.sender?.profilePicture ? (
                      <img alt={notif.sender?.name} className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg object-cover border border-white/10" src={notif.sender.profilePicture} />
                    ) : (
                      <div className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg bg-[#13ec5b33] text-[#13ec5b]">
                        <span className="material-symbols-outlined text-base sm:text-lg lg:text-xl">notifications</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5 sm:mb-1 gap-1 sm:gap-2">
                      <span className="text-[#13ec5b] text-[8px] sm:text-[9px] lg:text-[10px] font-bold uppercase tracking-wider">{notif.type}</span>
                      <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 flex-shrink-0">
                        <span className="text-white/40 text-[8px] sm:text-[9px] lg:text-[10px] hidden xs:inline">{new Date(notif.createdAt).toLocaleString()}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeNotification(notif._id); }}
                          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all p-0.5"
                        >
                          <span className="material-symbols-outlined text-[10px] sm:text-xs">close</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-white text-[11px] sm:text-xs lg:text-sm font-medium mb-1 leading-snug break-words">
                      {notif.sender?.name && <span className="text-white mr-1">{notif.sender.name}</span>}
                      <span className="text-white/60 font-normal">{notif.message}</span>
                    </p>
                    
                    {notif.type === 'request' && (
                      <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-2.5 lg:mt-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAction(notif._id, 'Accepted'); }}
                          className="flex-1 bg-[#13ec5b] text-[#102216] text-[10px] sm:text-[11px] lg:text-xs font-bold py-1.5 rounded-lg hover:bg-[#13ec5be6] transition-all cursor-pointer"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAction(notif._id, 'Declined'); }}
                          className="flex-1 bg-white/10 text-white text-[10px] sm:text-[11px] lg:text-xs font-bold py-1.5 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    
                    {notif.type === 'message' && (
                      <div className="mt-2 sm:mt-2.5 lg:mt-3">
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
                          className="w-full border border-[#13ec5b4d] text-[#13ec5b] text-[10px] sm:text-[11px] lg:text-xs font-bold py-1.5 rounded-lg hover:bg-[#13ec5b1a] transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[10px] sm:text-xs">reply</span> Reply
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
          <a className="block text-center py-2.5 sm:py-3 lg:py-4 text-white/60 text-[9px] sm:text-[10px] lg:text-xs font-bold hover:text-[#13ec5b] transition-all uppercase tracking-widest" href="#">
            <span className="hidden sm:inline">View All Notifications</span>
            <span className="sm:hidden">View All</span>
          </a>
        </footer>
      </div>
    </>
  );
};

export default NotificationModal;