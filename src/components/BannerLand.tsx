import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { PhoneCall } from "lucide-react";
import soundImg from "../assets/Images/soundwave.webp";

function BannerLand() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the icon movement
  const springConfig = { damping: 20, stiffness: 150 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Response range
    mouseX.set(x * 0.12); 
    mouseY.set(y * 0.12);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative">
        {/* Main Banner Card */}
        <motion.div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative w-full min-h-[400px] md:min-h-[500px] rounded-[3rem] overflow-hidden border border-slate-200 shadow-3xl flex flex-col items-center justify-center group cursor-none md:cursor-default"
        >
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 bg-white" />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-mesh opacity-70"
          />

          {/* Soundwave Image with Advanced Masking */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img
              src={soundImg}
              alt="sound wave"
              loading="lazy"
              className="w-full h-full object-cover scale-110"
            />
            {/* Vignette Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white" />
          </div>

          {/* Core Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Interactive Ringing Call Icon */}
            <motion.div 
              style={{ x: dx, y: dy }}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-10 relative"
            >
              <div className="w-24 h-24 rounded-3xl glass border-brand-primary/30 flex items-center justify-center mx-auto relative group/icon shadow-2xl">
                {/* Background Glows */}
                <div className="w-16 h-16 rounded-full bg-brand-primary/20 blur-2xl absolute animate-pulse" />
                
                {/* Ringing Waves */}
                <span className="absolute inset-0 rounded-3xl border border-brand-primary/40 animate-[ping_2s_linear_infinite]" />
                <span className="absolute inset-[-10px] rounded-3xl border border-brand-primary/10 animate-[ping_3s_linear_infinite]" />

                {/* The Phone Icon */}
                <motion.div 
                  animate={{ 
                    rotate: [-10, 10, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity, 
                    repeatDelay: 2 
                  }}
                  className="relative z-10 text-brand-primary"
                >
                  <PhoneCall size={42} strokeWidth={2.5} />
                </motion.div>
              </div>
            </motion.div>

            <motion.h2 
              initial={{ letterSpacing: "1em", opacity: 0, filter: "blur(10px)" }}
              whileInView={{ letterSpacing: "0.2em", opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-6xl md:text-9xl font-black text-slate-950 uppercase tracking-widest relative"
            >
              <span className="relative z-10">SUMA</span>
              {/* Ghost Glow Text */}
              <span className="absolute inset-0 blur-2xl opacity-30 text-brand-primary select-none pointer-events-none">SUMA</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-6 text-slate-400 font-bold uppercase tracking-[6px] text-xs md:text-sm"
            >
              The DNA of Digital Conversations
            </motion.p>
          </div>
          
          {/* Internal Accent Glows */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent" />
          <div className="absolute bottom-0 right-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-brand-secondary/50 to-transparent" />
        </motion.div>
        
        {/* Floating Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {[
            { label: "Stability", value: "99.9%" },
            { label: "Active Calls", value: "50k+" },
            { label: "Global Nodes", value: "12" },
            { label: "Accuracy", value: "98%" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              viewport={{ once: true }}
              className="glass border-slate-200 p-6 rounded-3xl text-center group hover:border-brand-primary/30 transition-colors"
            >
              <p className="text-2xl md:text-3xl font-black text-white mb-1 group-hover:text-brand-primary transition-colors">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BannerLand;
