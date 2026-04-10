import { motion } from "framer-motion";
import { 
  Headphones, 
  Calendar, 
  ClipboardList, 
  Wallet, 
  Users, 
  Code2, 
  ArrowRight
} from "lucide-react";
import LandCard from "../LandCard";
import { Link } from "react-router-dom";

function UseCases() {
  const useCases = [
    {
      title: "Customer Support",
      desc: "Deliver 24/7 AI-powered assistance with Suma.ai, without increasing staff costs.",
      icon: <Headphones size={40} />,
    },
    {
      title: "Appointment Scheduling",
      desc: "Suma.ai manages bookings, reschedules, and confirmations seamlessly.",
      icon: <Calendar size={40} />,
    },
    {
      title: "Survey & Feedback Calls",
      desc: "Gather valuable customer insights automatically, without human intervention.",
      icon: <ClipboardList size={40} />,
    },
    {
      title: "Collections & Reminders",
      desc: "Automate payment reminders and reduce overdue payments effortlessly with Suma.ai.",
      icon: <Wallet size={40} />,
    },
    {
      title: "HR & Recruitment",
      desc: "Suma.ai pre-screens candidates, schedules interviews, and follows up automatically.",
      icon: <Users size={40} />,
    },
    {
      title: "Custom Development",
      desc: "Tailored AI solutions from Suma.ai, designed to meet your unique business needs.",
      icon: <Code2 size={40} />,
    },
  ];

  return (
    <section id="about" className="relative py-24 px-6 md:px-12 bg-[#020617]">
      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="px-4 py-1.5 glass border-brand-primary/20 rounded-full text-[10px] md:text-xs font-bold text-brand-primary uppercase tracking-[3px]"
            >
              Use Cases
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-6xl font-black mt-6 text-white leading-[1.1]"
            >
              Tailored for <br />
              <span className="text-gradient">Every Industry.</span>
            </motion.h2>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-lg md:text-xl max-w-md md:text-right"
          >
            From Sales to Support, Suma.ai handles complex workflows with 
            human-like understanding.
          </motion.p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((item, index) => (
            <LandCard
              key={index}
              index={index}
              icon={item.icon}
              subtitle={item.title}
              desc={item.desc}
              className="hover:shadow-brand-primary/10 shadow-xl"
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 glass rounded-[3rem] border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-brand-primary/5 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
          
          <div className="relative z-10 flex flex-col items-center md:items-start">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to transform your workflow?</h3>
            <p className="text-slate-400">Join 100+ businesses automating their calls today.</p>
          </div>

          <Link to="/login" className="relative z-10 w-full md:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto px-10 py-5 btn-gradient rounded-full text-white font-black flex items-center justify-center gap-3 shadow-2xl shadow-brand-primary/25"
            >
              Request a Custom Demo
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default UseCases;
