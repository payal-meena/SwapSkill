import React, { useState } from 'react';

const NotificationModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "Exchange Request",
      time: "2m ago",
      user: "Liam Wilson",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
      text: "sent a request to swap React for French.",
      isUnread: true,
      hasActions: true
    },
    {
      id: 2,
      type: "New Message",
      time: "1h ago",
      user: "Sarah",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      text: 'messaged you: "Just uploaded the new Python resources for..."',
      isUnread: true,
      hasReply: true
    },
    {
      id: 3,
      type: "System Alert",
      time: "5h ago",
      icon: "verified",
      text: 'Skill Approved! Your "UI/UX Design" skill has been verified by the community.',
      isUnread: true
    }
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isUnread: false })));
  };

  const markSingleRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isUnread: false } : n
    ));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
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
            {notifications.filter(n => n.isUnread).length > 0 && (
              <span className="bg-[#13ec5b] text-[#102216] text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {notifications.filter(n => n.isUnread).length}
              </span>
            )}
          </div>
          <button 
            onClick={markAllRead}
            className="text-[#13ec5b] text-xs font-semibold hover:text-[#13ec5bce] transition-colors cursor-pointer"
          >
            Mark all as read
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-10 text-center text-white/40 text-sm">
              <span className="material-symbols-outlined text-4xl mb-2 block">notifications_off</span>
              No new notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => markSingleRead(notif.id)}
                className={`px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors relative cursor-pointer group ${notif.isUnread ? 'bg-[#13ec5b]/5' : ''}`}
              >
                {notif.isUnread && (
                  <div className="absolute right-5 top-5 h-2 w-2 rounded-full bg-[#13ec5b] shadow-[0_0_8px_rgba(19,236,91,0.6)]"></div>
                )}

                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    {notif.img ? (
                      <img alt={notif.user} className="h-10 w-10 rounded-lg object-cover border border-white/10" src={notif.img} />
                    ) : (
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#13ec5b33] text-[#13ec5b]">
                        <span className="material-symbols-outlined">{notif.icon}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[#13ec5b] text-[10px] font-bold uppercase tracking-wider">{notif.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-[10px]">{notif.time}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-white text-sm font-medium mb-1 leading-snug">
                      {notif.user && <span className="text-white mr-1">{notif.user}</span>}
                      <span className="text-white/60 font-normal">{notif.text}</span>
                    </p>
                    
                    {notif.hasActions && (
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAction(notif.id, 'Accepted'); }}
                          className="flex-1 bg-[#13ec5b] text-[#102216] text-xs font-bold py-1.5 rounded-lg hover:bg-[#13ec5be6] transition-all cursor-pointer"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAction(notif.id, 'Declined'); }}
                          className="flex-1 bg-white/10 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    
                    {notif.hasReply && (
                      <div className="mt-3">
                        <button 
                          onClick={(e) => e.stopPropagation()}
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