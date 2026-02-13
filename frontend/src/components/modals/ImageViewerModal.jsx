import React from 'react';
import { X, Download } from 'lucide-react';

const ImageViewerModal = ({ isOpen, onClose, image }) => {
  if (!isOpen || !image) return null;

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-lg"
      onClick={onClose} // background click pe close
    >
      <div className="relative max-w-[95vw] max-h-[95vh] p-4">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-top-16 sm:right-0 text-white bg-black/50 hover:bg-black/70 p-3 rounded-full transition z-10"
        >
          <X size={28} />
        </button>

        {/* Image */}
        <img
          src={image.url}
          alt={image.name || "Full screen image"}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()} // image pe click karne se close na ho
        />

        {/* Download Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // handleDownload ko props se pass kar sakte ho ya context se le sakte ho
            // yahan direct use kar rahe hain (agar global hai to)
            const link = document.createElement('a');
            link.href = image.url;
            link.download = image.name || 'image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="absolute bottom-6 right-6 bg-black/70 hover:bg-black/90 p-3 rounded-full text-white transition z-10 shadow-lg"
          title="Download"
        >
          <Download size={24} />
        </button>
      </div>
    </div>
  );
};

export default ImageViewerModal;