import React from 'react';
import { CheckCircle2, XCircle, Loader2, X, AlertTriangle, Trash2 } from 'lucide-react';

const AccountModal = ({ isOpen, onClose, type = 'success', title, message, onConfirm }) => {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: <CheckCircle2 className="text-[#13ec5b]" size={48} />,
      btnBg: 'bg-[#13ec5b]',
      btnText: 'Continue',
      textColor: 'text-[#102216]'
    },
    error: {
      icon: <XCircle className="text-red-500" size={48} />,
      btnBg: 'bg-red-500',
      btnText: 'Try Again',
      textColor: 'text-white'
    },
    delete: {
      icon: <Trash2 className="text-red-500" size={48} />,
      btnBg: 'bg-red-500',
      btnText: 'Yes, Delete Account',
      textColor: 'text-white'
    },
    loading: {
      icon: <Loader2 className="text-[#13ec5b] animate-spin" size={48} />,
      btnBg: 'bg-slate-200 dark:bg-[#23482f]',
      btnText: 'Processing...',
      textColor: 'text-slate-500'
    }
  };

  const current = config[type] || config.success;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#112217] w-full max-w-sm rounded-3xl border border-slate-200 dark:border-[#23482f] p-8 shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Hidden during loading */}
        {type !== 'loading' && (
          <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-slate-50 dark:bg-[#23482f]/30 rounded-full">
            {current.icon}
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {title}
          </h3>
          
          <p className="text-slate-500 dark:text-[#92c9a4] mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onConfirm || onClose}
              className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${current.btnBg} ${current.textColor} hover:opacity-90`}
            >
              {current.btnText}
            </button>

            {/* Cancel Button only shows if it's a confirmation modal */}
            {onConfirm && type !== 'loading' && (
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;