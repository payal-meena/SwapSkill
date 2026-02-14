import React from 'react';
import { X, Download } from 'lucide-react';

const ChatMediaModal = ({ 
  isOpen, 
  onClose, 
  mediaItems, 
  handleDownload 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#193322] border border-[#23482f] w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#23482f] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#13ec5b]">Shared Media</h2>
          <button 
            onClick={onClose}
            className="text-[#92c9a4] hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {mediaItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#92c9a4]">
              <Download size={64} className="mb-4 opacity-50" />
              <p className="text-lg">No media shared yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative rounded-xl overflow-hidden bg-[#112217] border border-[#23482f]"
                >
                  {/* Sender + Time */}
                  <div className="absolute top-2 left-2 z-10 bg-black/60 px-2 py-1 rounded text-xs text-white">
                    {item.sender} • {new Date(item.createdAt).toLocaleDateString([], { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>

                  {item.type === 'image' ? (
                    <>
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <span className="bg-black/60 p-3 rounded-full text-white">View</span>
                      </a>
                    </>
                  ) : item.type === 'pdf' ? (
                    <div className="h-48 flex flex-col items-center justify-center bg-[#1a2c22]">
                      <div className="text-red-500 text-5xl mb-2">PDF</div>
                      <p className="text-sm text-center px-4 truncate">{item.name}</p>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-[#1a2c22]">
                      <Download size={48} className="text-[#92c9a4]" />
                    </div>
                  )}

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(item.url, item.name)}
                    className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMediaModal;