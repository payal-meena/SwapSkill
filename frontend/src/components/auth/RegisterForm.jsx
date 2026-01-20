import React from 'react';

const RegisterForm = () => {
  return (
    <form className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1" htmlFor="full-name">Full Name</label>
        <input 
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] outline-none transition-all" 
          id="full-name" placeholder="John Doe" type="text"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1" htmlFor="email">Email Address</label>
        <input 
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] outline-none transition-all" 
          id="email" placeholder="name@company.com" type="email"
        />
      </div>
      <div className="relative">
        <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1" htmlFor="password">Password</label>
        <div className="relative">
          <input 
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] outline-none transition-all" 
            id="password" placeholder="••••••••" type="password"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#39FF14] transition-colors" type="button">
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-1 py-1">
        <input className="rounded border-white/20 bg-transparent text-[#39FF14] focus:ring-[#39FF14]" id="terms" type="checkbox"/>
        <label className="text-xs text-slate-400" htmlFor="terms">
          I agree to the <a className="text-[#39FF14] font-semibold" href="#">Terms</a> and <a className="text-[#39FF14] font-semibold" href="#">Privacy</a>
        </label>
      </div>
      <button className="w-full bg-gradient-to-r from-[#39FF14] to-[#00cc00] text-black font-bold py-4 rounded-xl shadow-lg shadow-[#39FF14]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2" type="submit">
        Get Started <span className="material-symbols-outlined">arrow_forward</span>
      </button>
    </form>
  );
};

export default RegisterForm;