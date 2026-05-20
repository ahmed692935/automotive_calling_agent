import { motion, type Variants } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroVideo from "../assets/Videos/herobg.mp4";
import Header from "./HeaderLanding";

function LandHeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover scale-[1.05]"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Modern Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-[#f8fafc]" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-70" />
      </div>

      {/* Header */}
      <Header />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 sm:px-12 max-w-7xl mx-auto pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 px-4 py-2 mb-8 glass rounded-full border-brand-primary/20 animate-float"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[2px] text-brand-primary">
              AI-Powered Outreach Agent
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-8xl font-black leading-[1] tracking-tight mb-6"
          >
            <span className="block text-slate-950">Smarter Calls,</span>
            <span className="block text-gradient">Better Results.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="max-w-xl sm:max-w-2xl md:max-w-3xl text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed mb-10"
          >
            Transform your calling experience with Suma.ai. Our lifelike AI agents handle outreach, support, and follow-ups with human DNA, allowing you to scale without limits.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-lg"
          >
            <Link to="/login" className="w-full sm:w-auto group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full btn-gradient text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-brand-primary/20"
              >
                Start for Free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <Link to="/login" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full glass border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-all"
              >
                <PlayCircle className="text-brand-primary" />
                Book a Demo
              </motion.button>
            </Link>
          </motion.div>

          {/* Social Proof Placeholder */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-col items-center gap-4 opacity-50 hover:opacity-100 transition-opacity"
          >
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Trusted by modern startups</p>
            <div className="flex flex-wrap justify-center gap-8 grayscale">
               {/* Logos would go here */}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-[30px] h-[50px] border-2 border-slate-300 rounded-full flex justify-center p-2 bg-white/40">
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1.5 h-1.5 bg-brand-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

export default LandHeroSection;
