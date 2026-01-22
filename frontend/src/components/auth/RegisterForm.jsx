import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/users/signup", {
        name,
        email,
        password
      });

      setMessage("Registration successful ✅");
      navigate("/dashboard"); 


    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <form className="w-full space-y-8" onSubmit={handleSubmit}>

      <div className="flex flex-col w-full group">
        <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-1 ml-1 group-focus-within:text-primary transition-colors text-left">
          Full Name
        </label>
        <input 
          className="w-full bg-transparent border-0 border-b border-white/10 text-white py-3 px-1 text-sm font-light focus:ring-0 focus:outline-none focus:border-primary transition-all duration-300" 
          id="full-name" 
          placeholder="John Doe" 
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full group">
        <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-1 ml-1 group-focus-within:text-primary transition-colors text-left">
          Email Address
        </label>
        <input 
          className="w-full bg-transparent border-0 border-b border-white/10 text-white py-3 px-1 text-sm font-light focus:ring-0 focus:outline-none focus:border-primary transition-all duration-300" 
          id="email" 
          placeholder="alex@example.com" 
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full group relative">
        <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-1 ml-1 group-focus-within:text-primary transition-colors text-left">
          Password
        </label>
        <div className="relative">
          <input 
            className="w-full bg-transparent border-0 border-b border-white/10 text-white py-3 px-1 text-sm font-light focus:ring-0 focus:outline-none focus:border-primary transition-all duration-300" 
            id="password" 
            placeholder="••••••••" 
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary transition-colors" type="button">
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        <input 
          className="rounded border-white/20 bg-transparent text-primary focus:ring-primary size-4" 
          id="terms" 
          type="checkbox"
          required
        />
        <label className="text-[11px] text-white/40 font-medium" htmlFor="terms">
          I agree to the <a className="text-white/60 hover:text-primary underline" href="#">Terms</a> and <a className="text-white/60 hover:text-primary underline" href="#">Privacy</a>
        </label>
      </div>

      {message && (
        <p className="text-center text-sm text-white/70">{message}</p>
      )}

      <div className="pt-2">
        <button className="w-full bg-primary text-[#0a0f0c] h-14 rounded-full font-extrabold text-base tracking-tight hover:shadow-[0_0_20px_rgba(37,244,123,0.4)] transition-all duration-300 active:scale-[0.98]" type="submit">
          Get Started
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
