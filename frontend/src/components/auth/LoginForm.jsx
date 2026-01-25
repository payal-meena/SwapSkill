import React, { useState } from 'react';
import axios from 'axios';
 import { useNavigate } from 'react-router-dom';

const LoginForm = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      setMessage("Login successful!");
     navigate("/dashboard"); 
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form className="w-full space-y-8" onSubmit={handleSubmit}>
      <div className="flex flex-col w-full group">
        <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-1 ml-1 group-focus-within:text-primary transition-colors text-left">
          Email Address
        </label>
        <input
          className="w-full bg-transparent border-0 border-b border-white/10 text-white py-3 px-1 text-sm font-light focus:ring-0 focus:outline-none focus:border-primary transition-all duration-300"
          placeholder="alex@example.com"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full group">
        <div className="flex justify-between items-end mb-1">
          <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold ml-1 group-focus-within:text-primary transition-colors">
            Password
          </label>
          <a className="text-white/30 hover:text-primary text-[10px] uppercase tracking-widest transition-colors" href="#forgot">
            Forgot?
          </a>
        </div>
        <input
          className="w-full bg-transparent border-0 border-b border-white/10 text-white py-3 px-1 text-sm font-light focus:ring-0 focus:outline-none focus:border-primary transition-all duration-300"
          placeholder="••••••••"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {message && (
        <p className="text-center text-sm text-white/70">{message}</p>
      )}

      <div className="pt-6">
        <button
          className="w-full bg-primary text-[#0a0f0c] h-14 rounded-full font-extrabold text-base tracking-tight hover:shadow-[0_0_20px_rgba(37,244,123,0.4)] transition-all duration-300 active:scale-[0.98]"
          type="submit"
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
