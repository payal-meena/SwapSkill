import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
        <footer className="mt-auto py-12 px-4 border-t border-slate-200 dark:border-white/10">
    <div className="bg-primary rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      <div className="relative z-10 text-center md:text-left">
        <h3 className="text-background-dark text-3xl font-black mb-2">Ready to share your talent?</h3>
        <p className="text-background-dark/80 text-lg max-w-md">Join 50,000+ members exchanging knowledge across 500+ different skills.</p>
      </div>
      <Link to="/auth" className="relative z-10 bg-background-dark text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform">
        Get Started
      </Link>
    </div>
    <div className="flex flex-col md:flex-row items-center justify-between mt-12 gap-6 text-slate-500 text-sm">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">auto_awesome</span>
        <span>© 2024 SwapSkill Inc. Empowering peer-to-peer growth.</span>
      </div>
      <div className="flex gap-8">
        <a className="hover:text-primary" href="#">Terms</a>
        <a className="hover:text-primary" href="#">Privacy</a>
        <a className="hover:text-primary" href="#">Help Center</a>
      </div>
    </div>
  </footer>
    </div>
  )
}

export default Footer