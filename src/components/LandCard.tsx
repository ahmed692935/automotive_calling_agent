import React from "react";
import { motion } from "framer-motion";

interface LandCardProps {
  icon?: React.ReactNode;
  img?: string;
  title?: string;
  subtitle?: string;
  value?: string;
  desc?: string;
  className?: string;
  children?: React.ReactNode;
  index?: number;
}

const LandCard: React.FC<LandCardProps> = ({
  icon,
  img,
  title,
  subtitle,
  value,
  desc,
  className = "",
  children,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -10, 
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        borderColor: "rgba(37, 99, 235, 0.28)",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)"
      }}
      className={`relative group glass rounded-[2rem] p-8 flex flex-col items-center text-center transition-all duration-300 ${className}`}
    >
      {/* Decorative Blur Background on hover */}
      <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity rounded-[2rem]" />

      {/* Image or Icon Container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
        {img ? (
          <img
            src={img}
            alt={title || "Card image"}
            className="h-16 w-16 object-contain relative z-10"
            loading="lazy"
          />
        ) : (
          icon && (
            <div className="text-4xl text-brand-primary relative z-10">
              {icon}
            </div>
          )
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {title && (
          <p className="text-[10px] uppercase tracking-[3px] font-black text-brand-primary mb-3">
            {title}
          </p>
        )}

        {subtitle && (
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-950 leading-snug">
            {subtitle}
          </h3>
        )}

        {value && (
          <p className="font-black text-4xl text-gradient mt-2 mb-4">
            {value}
          </p>
        )}

        {desc && (
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            {desc}
          </p>
        )}

        {children && <div className="mt-6 w-full">{children}</div>}
      </div>
      
      {/* Corner Accent */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-brand-primary transition-colors" />
    </motion.div>
  );
};

export default LandCard;
