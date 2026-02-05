import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", { email, password });
      localStorage.setItem("token", response.data.token);
      if (response.data.role) {
        localStorage.setItem("role", response.data.role);
      }
      if (response.data.userId || response.data._id) {
        localStorage.setItem("userId", response.data.userId || response.data._id);
      }
      setMessage("Login successful! ✅");
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-7" 
      onSubmit={handleSubmit}
    >
      {/* Email Field */}
      <div className="flex flex-col w-full group">
        <label className="text-white/40 text-[10px] uppercase font-bold mb-1 ml-1 group-focus-within:text-primary transition-colors text-left">
          Email Address
        </label>
        <input
          className="w-full bg-transparent border-0 border-b border-white/10 text-white py-3 px-1 text-sm focus:ring-0 focus:outline-none focus:border-primary transition-all duration-300"
          placeholder="alex@example.com"
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password Field with Eye Icon */}
      <div className="flex flex-col w-full group relative">
        <div className="flex justify-between items-end mb-1">
          <label className="text-white/40 text-[10px] uppercase font-bold ml-1 group-focus-within:text-primary transition-colors text-left">
            Password
          </label>
          <a className="text-white/30 hover:text-primary text-[10px] uppercase transition-colors font-medium" href="#forgot">
            Forgot?
          </a>
        </div>
        <div className="relative">
          <input
            className="w-full bg-transparent border-0 border-b border-white/10 text-white py-3 px-1 text-sm focus:ring-0 focus:outline-none focus:border-primary transition-all duration-300"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary transition-colors" 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      </div>

      {message && <p className="text-center text-xs text-primary font-medium">{message}</p>}

      <div className="pt-4">
        <button className="w-full bg-primary text-[#0a0f0c] h-14 rounded-full font-extrabold text-base tracking-tight hover:shadow-[0_0_20px_rgba(37,244,123,0.4)] transition-all duration-300 active:scale-[0.98]">
          Sign In
        </button>
      </div>
    </motion.form>
  );
};

export default LoginForm;