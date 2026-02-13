// src/components/modals/LogOut.jsx

import React from 'react';
import { createPortal } from 'react-dom';
import { LogOut as LogOutIcon } from 'lucide-react';

const LogOut = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 z-[99999]">
      {/* Backdrop - click outside to close */}
      <div
        className="absolute inset-0 bg-black/98 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-[100000] min-h-screen flex items-center justify-center p-4">
        <div
          className="
            bg-[#102216] 
            w-full max-w-md 
            rounded-3xl 
            overflow-hidden
            border border-[#13ec5b]/30
            shadow-2xl shadow-black/80 shadow-[#13ec5b]/10
          "
        >
          <div className="p-10 text-center relative">
            <LogOutIcon size={48} className="text-[#13ec5b] mx-auto mb-6" />

            <h2 className="text-2xl font-black text-white tracking-tight mb-4">
              Log Out?
            </h2>

            <p className="text-gray-400 mb-10">
              You can always sign back in later.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onClose}
                className="
                  px-10 py-3.5 rounded-xl 
                  border border-gray-600 
                  text-gray-300 font-medium
                  hover:bg-gray-800 hover:border-gray-500 
                  transition-all active:scale-95
                "
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="
                  px-10 py-3.5 rounded-xl 
                  bg-[#13ec5b] 
                  text-black font-bold
                  hover:brightness-110 hover:shadow-lg hover:shadow-[#13ec5b]/30
                  transition-all active:scale-95
                "
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default LogOut;