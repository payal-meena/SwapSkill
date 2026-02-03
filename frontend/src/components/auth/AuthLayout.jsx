import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="bg-[#0a0f0c] min-h-screen flex flex-col font-display text-white relative overflow-hidden">
      {/* Main Container - justify-start use kiya hai taaki top se fix rahe */}
      <main className="flex-1 flex flex-col items-center pt-20 px-4 z-10">
        
        {/* LOGO SECTION - Absolutely Fixed Position */}
        <div className="h-14 flex items-center justify-center mb-2">
          <Link to="/" className="group">
            <div className="size-12 text-primary transition-transform duration-300 group-hover:scale-110">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" />
              </svg>
            </div>
          </Link>
        </div>

        {/* TEXT SECTION - Kam Gap aur Fixed Height */}
        <div className="h-24 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <h1 className="text-white text-4xl font-extrabold tracking-tight mb-1 uppercase leading-tight">
                {title}
              </h1>
              <p className="text-[#25f47b]/60 text-sm font-light tracking-wide">
                {subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FORM SECTION - mt-2 se gap kam kiya hai */}
        <div className="max-w-[440px] w-full mt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname} // Route change pe smooth transition
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;