import { motion } from "framer-motion";
import LandCard from "../LandCard";

function CallAction() {
  const callStats = [
    {
      title: "Speed to Launch",
      value: "24 Hours",
      desc: "Average time from setup to your first live AI-powered call campaign.",
    },
    {
      title: "Resource Efficiency",
      value: "60% Savings",
      desc: "Drastically reduce overhead costs while increasing your outbound capacity.",
    },
    {
      title: "Feature Rich",
      value: "100+ Tools",
      desc: "From sentiment analysis to live CRM sync, we have everything you need.",
    },
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 bg-[#f8fafc] overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-4 py-1.5 glass border-brand-primary/20 rounded-full text-[10px] md:text-xs font-bold text-brand-primary uppercase tracking-[3px] mb-6"
          >
            The Suma Edge
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-slate-950 leading-tight"
          >
            Making Every Interaction <br />
            <span className="text-gradient">Effortless.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl mt-6 max-w-2xl"
          >
            We don't just automate calls; we enhance human connection with 
            intelligence and speed.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {callStats.map((item, i) => (
            <LandCard
              key={i}
              index={i}
              title={item.title}
              value={item.value}
              desc={item.desc}
              className="bg-white/80 border-slate-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CallAction;
