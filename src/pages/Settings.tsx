import { useState, useRef } from "react";
import VoiceSettings from "./VoiceSettings";
import PromptSettings from "../components/PromptSettings";
import { motion, AnimatePresence } from "framer-motion";
import { FiMic, FiCode, FiSave, FiRefreshCw } from "react-icons/fi";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<"voice" | "prompt">("voice");
  const promptRef = useRef<{ save: () => void; refresh: () => void } | null>(null);

  const tabs = [
    { id: "voice", label: "Voice Selection", icon: <FiMic size={16} /> },
    { id: "prompt", label: "Prompt Settings", icon: <FiCode size={16} /> }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight text-white">
            Agent <span className="text-gradient">Configuration</span>
          </h1>
          <p className="text-slate-400 font-medium">Manage your AI agent's vocal identity and logic</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex p-1.5 glass rounded-2xl border-slate-800/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-settings-tab"
                    className="absolute inset-0 bg-brand-primary rounded-xl shadow-lg shadow-brand-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === "prompt" && (
            <div className="flex items-center gap-2">
               <button
                onClick={() => promptRef.current?.refresh()}
                className="p-3 glass rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95 border-slate-800/50"
                title="Refresh Prompt"
              >
                <FiRefreshCw size={18} />
              </button>
              <button
                onClick={() => promptRef.current?.save()}
                className="flex items-center gap-2 px-6 py-2.5 btn-gradient text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/20 active:scale-95"
              >
                <FiSave size={18} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === "voice" ? (
            <motion.div
              key="voice"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <VoiceSettings />
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PromptSettings onActionsReady={(actions) => { promptRef.current = actions }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Settings;
