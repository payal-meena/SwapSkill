import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div>
    <header className="sticky top-5 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-white/10 px-4 md:px-10 py-3 bg-white/5 backdrop-blur-md rounded-xl">
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
    <div className="hidden md:flex flex-1 justify-end gap-8">
      <nav className="flex items-center gap-9">
        <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#browse-skills">Home</a>
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
    <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="md:hidden text-slate-900 dark:text-white">
      <span className="material-symbols-outlined">menu</span>
    </button>

    {/* Mobile menu */}
    {mobileOpen && (
      <div className="fixed inset-0 z-40 flex">
        <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
        <div className="ml-auto w-72 bg-white/5 dark:bg-[#0b1a12] p-6 backdrop-blur-md h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="size-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold">SwapSkill</h2>
            </div>
            <button onClick={() => setMobileOpen(false)} className="text-slate-400">✕</button>
          </div>

          <nav className="flex flex-col gap-4">
            <a onClick={() => setMobileOpen(false)} className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#browse-skills">Home</a>
            <a onClick={() => setMobileOpen(false)} className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
            <a onClick={() => setMobileOpen(false)} className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#about">About</a>
            <Link onClick={() => setMobileOpen(false)} className="mt-4 flex min-w-full items-center justify-center rounded-xl h-10 px-6 bg-primary text-background-dark text-sm font-bold tracking-[0.015em] hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20" to="/auth">Join Now</Link>
          </nav>
        </div>
      </div>
    )}
  </header>
    </div>
  )
}

export default Navbar