import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, Play, BarChart4, ArrowRight } from "lucide-react";

function ThreeSteps() {
  const steps = [
    {
      title: "Assign a Task",
      desc: "Set up your requirements—from sales to support follow-ups.",
      icon: <Play className="text-brand-primary" size={24} />,
      color: "from-blue-500/20 to-cyan-500/0"
    },
    {
      title: "AI Takes Over",
      desc: "Suma.ai dials and engages in real-time, just like a human expert.",
      icon: <CheckCircle2 className="text-brand-secondary" size={24} />,
      color: "from-indigo-500/20 to-purple-500/0"
    },
    {
      title: "Track & Optimize",
      desc: "Access instant transcripts and insights to improve every call.",
      icon: <BarChart4 className="text-brand-accent" size={24} />,
      color: "from-rose-500/20 to-orange-500/0"
    },
  ];

  return (
    <section id="use" className="relative py-24 px-6 md:px-12 bg-[#020617] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/5 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-6xl font-black text-white mb-6"
          >
            3 Steps to <span className="text-gradient">Automation.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Boost engagement and drive results effortlessly with our 
            streamlined AI integration process.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent -translate-y-12" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${step.color} rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative glass border-slate-800 rounded-[2.5rem] p-10 flex flex-col items-center text-center h-full hover:border-slate-700 transition-all duration-300">
                {/* Step Number Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-brand-primary text-sm shadow-2xl">
                  0{index + 1}
                </div>

                {/* Icon Circle */}
                <div className="w-16 h-16 rounded-3xl glass border-slate-700 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 flex flex-col items-center"
        >
          <div className="text-slate-500 font-bold tracking-[4px] uppercase text-[10px] mb-8">It's really that simple</div>
          
          <Link to="/login">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 glass border-slate-700 hover:border-brand-primary text-white font-black rounded-full flex items-center justify-center gap-3 transition-colors group"
            >
              Get Started with Suma.ai
              <ArrowRight className="text-brand-primary group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default ThreeSteps;
