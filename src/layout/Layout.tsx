import React from "react";
import Navbar from "../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen text-slate-900 overflow-x-hidden relative bg-[#f4f7fa]">
      {/* PREMIUM SOLID BASE: 
        Humne gradient bilkul khatam kar diya hai. #f4f7fa aik aisi tone hai jo white cards 
        (jo aapke Total Calls, Successful Calls wale hain) ko aik zabardast dynamic pop aur contrast degi.
      */}

      {/* Fixed Header/Navbar Wrapper with Ultra-Clean Separation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} 
            /* Premium easeOutCubic transition for cinematic page loads */
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern Minimalistic Border Accent */}
      <div className="fixed bottom-0 left-0 w-full h-[1px] bg-slate-200/60 z-20" />
    </div>
  );
};

export default Layout;

