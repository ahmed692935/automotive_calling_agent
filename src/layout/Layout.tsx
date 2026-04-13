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
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden relative">
      {/* Global Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 bg-gradient-mesh opacity-60 pointer-events-none" />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Fixed Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Subtle Bottom Glow */}
      <div className="fixed bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent z-20" />
    </div>
  );
};

export default Layout;
