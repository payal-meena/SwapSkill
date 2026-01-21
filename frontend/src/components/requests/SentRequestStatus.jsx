import React from 'react';

const SentRequestStatus = ({ title, status, img, progressStep }) => {
  const steps = ["Requested", "Accepted", "In Progress"];
  const isActive = status === "In Progress";

  return (
    <div className={`bg-[#19332266] backdrop-blur-md border-l-4 rounded-2xl p-6 ${isActive ? 'border-[#13ec5b]' : 'border-slate-600'}`}>
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <img className={`h-12 w-12 rounded-lg object-cover ${!isActive && 'grayscale'}`} src={img} alt={title} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">{title}</h3>
            <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${isActive ? 'text-[#13ec5b] bg-[#13ec5b1a]' : 'text-slate-400 bg-white/5'}`}>
              {status}
            </span>
          </div>
          
          {/* Progress Stepper */}
          <div className={`flex items-center w-full max-w-2xl px-4 ${!isActive && 'opacity-60'}`}>
            {steps.map((step, idx) => (
              <div key={step} className={`flex flex-col items-center flex-1 relative ${idx < steps.length - 1 ? 'after:content-[""] after:absolute after:top-2 after:left-1/2 after:w-full after:h-[2px]' : ''} ${idx <= progressStep ? 'after:bg-[#13ec5b]' : 'after:bg-[#23482f]'}`}>
                <div className={`w-4 h-4 rounded-full z-10 ${idx <= progressStep ? 'bg-[#13ec5b]' : 'bg-[#23482f] border border-[#326744]'}`}>
                  {idx === progressStep && isActive && (
                    <div className="w-full h-full rounded-full bg-[#13ec5b] shadow-[0_0_10px_rgba(19,236,91,0.5)] animate-pulse" />
                  )}
                </div>
                <p className={`text-[10px] mt-2 font-bold ${idx <= progressStep ? 'text-[#13ec5b]' : 'text-slate-500'}`}>{step}</p>
              </div>
            ))}
          </div>
        </div>
        <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${isActive ? 'bg-[#23482f] text-white hover:bg-[#326744]' : 'border border-[#326744] text-slate-400 hover:text-white'}`}>
          {isActive ? 'Go to Workspace' : 'Withdraw Request'}
        </button>
      </div>
    </div>
  );
};

export default SentRequestStatus;