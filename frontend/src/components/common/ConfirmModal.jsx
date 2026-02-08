import React from 'react'

const ConfirmModal = ({ isOpen, title = 'Confirm', message, confirmLabel = 'Yes', cancelLabel = 'Cancel', onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#0d120e] border border-[#13ec5b]/20 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-white/5 text-slate-300 rounded-xl">{cancelLabel}</button>
          <button onClick={() => { onConfirm && onConfirm(); }} className="flex-1 py-3 bg-[#13ec5b] text-black font-bold rounded-xl">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
