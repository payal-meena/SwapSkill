import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative">
      <header className="sticky top-5 z-[100] flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-white/10 px-4 md:px-10 py-3 bg-white/10 backdrop-blur-md rounded-xl">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <a href="#hero" className="flex items-center gap-4">
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold">SwapSkill</h2>
          </a>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 justify-end gap-8">
          <nav className="flex items-center gap-9">
            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#hero">Home</a>
            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
            <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#about">About</a>
          </nav>
          <Link 
            className="flex min-w-[100px] items-center justify-center rounded-xl h-10 px-6 bg-primary text-background-dark text-sm font-bold tracking-[0.015em] hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
            to="/auth"
          >
            Join Now
          </Link>
        </div>

        {/* Mobile Menu Toggle (3 Lines) */}
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="md:hidden text-slate-900 dark:text-white flex flex-col gap-1.5 p-2">
           <span className="w-6 h-0.5 bg-current rounded-full"></span>
           <span className="w-6 h-0.5 bg-current rounded-full"></span>
           <span className="w-6 h-0.5 bg-current rounded-full"></span>
        </button>

        {/* Mobile Sidebar - Fixed and Full Height */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[200] md:hidden">
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            
            {/* Right Side Panel */}
            <div className="absolute top-0 right-0 w-[80%] max-w-sm h-screen bg-[#0a140e] border-l border-white/10 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="size-8 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">SwapSkill</h2>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-white bg-white/10 p-2 rounded-full hover:bg-white/20">
                  <span className="material-symbols-outlined block">close</span>
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                <a onClick={() => setMobileOpen(false)} className="text-slate-300 text-lg py-4 border-b border-white/5 font-medium hover:text-primary transition-colors" href="#hero">Home</a>
                <a onClick={() => setMobileOpen(false)} className="text-slate-300 text-lg py-4 border-b border-white/5 font-medium hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
                <a onClick={() => setMobileOpen(false)} className="text-slate-300 text-lg py-4 border-b border-white/5 font-medium hover:text-primary transition-colors" href="#about">About</a>
                <Link onClick={() => setMobileOpen(false)} className="mt-8 flex w-full items-center justify-center rounded-2xl h-14 bg-primary text-background-dark text-lg font-black shadow-lg shadow-primary/20" to="/auth">
                    Join Now
                </Link>
              </nav>

              <div className="mt-auto text-center pb-6">
                 <p className="text-slate-500 text-xs uppercase tracking-widest">Knowledge is the only currency</p>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}

export default Navbar;