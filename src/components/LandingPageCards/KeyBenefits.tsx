import { motion } from "framer-motion";
import { Zap, ShieldCheck, TrendingUp, Clock, Cpu, BarChart3 } from "lucide-react";
import LandCard from "../LandCard";

function KeyBenefits() {
  const benefits = [
    {
      title: "Efficiency",
      icon: <Clock />,
      subtitle: "Boost Efficiency",
      desc: "Stop wasting hours on repetitive tasks. Suma.ai automates your calling workflow so your team can focus on scaling.",
    },
    {
      title: "Cost Control",
      icon: <Cpu />,
      subtitle: "Cut Costs by 80%",
      desc: "Forget expensive call centers. Get unlimited, scalable AI-powered capacity at a fraction of the traditional cost.",
    },
    {
      title: "Growth",
      icon: <TrendingUp />,
      subtitle: "80% More Revenue",
      desc: "Convert more leads with AI precision. Our agents handle qualification and follow-ups to ensure no deal is missed.",
    },
    {
      title: "Availability",
      icon: <ShieldCheck />,
      subtitle: "24/7 Connectivity",
      desc: "Suma.ai never sleeps. Engage your customers across any timezone, instantly and effectively.",
    },
    {
      title: "Integration",
      icon: <Zap />,
      subtitle: "Seamless Sync",
      desc: "Connects with your existing CRM and databases. Zero friction, zero complex setups. Just results.",
    },
    {
      title: "Analytics",
      icon: <BarChart3 />,
      subtitle: "AI Insights",
      desc: "Every call is transcribed and analyzed. Get deep data-driven insights into customer sentiment and behavior.",
    },
  ];

  return (
    <section id="services" className="relative py-24 px-6 md:px-12 bg-[#020617]">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-20 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-4 py-1.5 glass border-brand-primary/20 rounded-full text-[10px] md:text-xs font-bold text-brand-primary uppercase tracking-[3px]"
          >
            Why Suma.ai
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-6xl font-black mt-6 text-white leading-[1.1]"
          >
            Next-Gen Performance. <br />
            <span className="text-gradient">No Compromise.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-base md:text-xl mt-6 max-w-2xl"
          >
            Empower your business with AI agents that talk like humans and work like machines. 
            Scale your outreach without increasing your headcount.
          </motion.p>
        </div>

        {/* Benefit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((item, index) => (
            <LandCard
              key={index}
              index={index}
              title={item.title}
              icon={item.icon}
              subtitle={item.subtitle}
              desc={item.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default KeyBenefits;
