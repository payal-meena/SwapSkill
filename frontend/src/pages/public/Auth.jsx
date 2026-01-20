import React, { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false); 

  return (
    <div className="bg-[#080808] min-h-screen text-white flex flex-col lg:flex-row font-display">
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-center bg-no-repeat bg-cover opacity-40" 
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800")' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent"></div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-[#39FF14] p-2 rounded-lg shadow-[0_0_10px_rgba(57,255,20,0.4)]">
             <span className="material-symbols-outlined text-black font-bold">swap_horiz</span>
          </div>
          <h2 className="text-white text-2xl font-bold tracking-tight">SwapSkill</h2>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-[#39FF14] text-5xl font-bold leading-tight mb-6">Master new skills by teaching what you know.</h1>
        </div>
        <div className="relative z-10 flex gap-12">
          <div><p className="text-[#39FF14] text-3xl font-bold">15k+</p><p className="text-slate-400 text-sm">Active Learners</p></div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24 bg-[#080808]">
        <div className="mx-auto w-full max-w-[460px] bg-[#121212]/70 backdrop-blur-xl border border-white/10 p-8 rounded-2xl">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Join SwapSkill'}</h2>
            <p className="text-slate-400">{isLogin ? 'Login to continue.' : 'Create account to start swapping.'}</p>
          </div>

          <div className="flex h-12 w-full items-center justify-center rounded-xl bg-white/5 p-1 mb-8 border border-white/10">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all cursor-pointer ${isLogin ? 'bg-white/10 text-white' : 'text-slate-500'}`}
            >Login</button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all cursor-pointer ${!isLogin ? 'bg-gradient-to-r from-[#39FF14] to-[#00cc00] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]' : 'text-slate-500'}`}
            >Sign Up</button>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default Auth;