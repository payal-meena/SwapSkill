import React from 'react';

const LoginForm = () => {
  return (
    <form className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1" htmlFor="login-email">Email Address</label>
        <input 
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] outline-none transition-all" 
          id="login-email" placeholder="name@company.com" type="email"
        />
      </div>
      <div className="relative">
        <div className="flex justify-between items-center mb-1.5 ml-1">
          <label className="block text-sm font-medium text-slate-300" htmlFor="login-password">Password</label>
          <a className="text-xs font-semibold text-[#39FF14] hover:brightness-110" href="#">Forgot?</a>
        </div>
        <input 
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] outline-none transition-all" 
          id="login-password" placeholder="••••••••" type="password"
        />
      </div>
      <button className="w-full bg-gradient-to-r from-[#39FF14] to-[#00cc00] text-black font-bold py-4 rounded-xl shadow-lg shadow-[#39FF14]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2" type="submit">
        Login <span className="material-symbols-outlined">login</span>
      </button>
    </form>
  );
};

export default LoginForm;