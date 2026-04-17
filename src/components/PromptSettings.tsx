import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiMessageCircle, FiMapPin, FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import type { RootState } from "../store/store";
import { getFlowPrompt, updateFlowPrompt } from "../api/retell";
import type { FlowEditorResponse } from "../interfaces/voice";

interface PromptSettingsProps {
  onActionsReady?: (actions: { save: () => void; refresh: () => void }) => void;
}

const PromptSettings = ({ onActionsReady }: PromptSettingsProps) => {
  const [data, setData] = useState<FlowEditorResponse | null>(null);
  const [prompt, setPrompt] = useState("");
  const [introNodeId, setIntroNodeId] = useState("");
  const [introText, setIntroText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.user?.access_token);

  const fetchPrompt = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setServerError(null);
      const res = await getFlowPrompt(token);
      setData(res);
      setPrompt(res.global_prompt);
      setIntroNodeId(res.intro_node_id);
      setIntroText(res.intro_text);
    } catch (err: any) {
      toast.error("Failed to fetch prompt configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token || !prompt || saving) return;
    setServerError(null);
    try {
      setSaving(true);
      await updateFlowPrompt(token, { 
        global_prompt: prompt,
        intro_node_id: introNodeId,
        intro_text: introText
      });
      toast.success("Configuration updated successfully");
      if (data) setData({ ...data, global_prompt: prompt, intro_node_id: introNodeId, intro_text: introText });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to update configuration";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchPrompt();
  }, [token]);

  useEffect(() => {
    if (onActionsReady) {
      onActionsReady({ save: handleSave, refresh: fetchPrompt });
    }
  }, [onActionsReady, prompt, introNodeId, introText, token, saving]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const isNodeError = serverError?.toLowerCase().includes("node");

  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass border-rose-500/30 bg-rose-500/5 rounded-[1.5rem] overflow-hidden"
          >
            <div className="p-6 flex items-start gap-4">
              <div className="p-2 bg-rose-500/20 rounded-xl text-rose-500">
                <FiXCircle size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-1">Configuration Error</h4>
                <p className="text-sm text-rose-200/80 leading-relaxed font-medium">{serverError}</p>
              </div>
              <button 
                onClick={() => setServerError(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <FiXCircle size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className={`glass p-8 rounded-[2rem] border transition-all duration-300 h-full ${
            isNodeError ? "border-rose-500/40 bg-rose-500/5" : "border-slate-800/50"
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${isNodeError ? "bg-rose-500/20 text-rose-500" : "bg-brand-primary/10 text-brand-primary"}`}>
                <FiMapPin size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">Entry Point</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`text-[10px] font-black uppercase tracking-[2px] mb-2 block ${isNodeError ? "text-rose-500" : "text-slate-500"}`}>
                  Intro Node ID
                </label>
                <input
                  type="text"
                  value={introNodeId}
                  onChange={(e) => {
                    setIntroNodeId(e.target.value);
                    if (isNodeError) setServerError(null);
                  }}
                  className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-slate-300 font-mono text-sm focus:outline-none transition-all ${
                    isNodeError ? "border-rose-500/50 focus:border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]" : "border-slate-800 focus:border-brand-primary/50"
                  }`}
                  placeholder="e.g. start-node-suma"
                />
              </div>
              {isNodeError ? (
                <p className="text-[10px] text-rose-400 font-bold italic animate-pulse">Node reference invalid — check your flow map.</p>
              ) : (
                <p className="text-[10px] text-slate-500 italic">Identifies the first stage of the journey.</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass p-8 rounded-[2rem] border-slate-800/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                <FiMessageCircle size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">Introduction Message</h3>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-2 block">Intro Text Content</label>
              <textarea
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                className="w-full h-32 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-slate-300 text-sm leading-relaxed focus:outline-none focus:border-brand-primary/50 resize-none"
                placeholder="How the agent greets the caller..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] overflow-hidden border-slate-800/50 shadow-2xl">
        <div className="p-8 space-y-6">
          {loading ? (
            <div className="space-y-4">
              <div className="h-4 w-1/4 bg-slate-800 rounded-lg animate-pulse" />
              <div className="h-80 w-full bg-slate-800/50 rounded-3xl animate-pulse" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Core System Instructions</label>
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                  <FiAlertCircle className="text-amber-500" size={12} />
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Crucial: Do not break transition nodes</span>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-brand-primary/20 to-transparent rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="relative w-full h-[500px] bg-slate-950/50 border border-slate-800 rounded-[2rem] p-8 text-slate-300 font-mono text-sm leading-relaxed focus:outline-none focus:border-brand-primary/50 transition-all resize-none shadow-inner custom-scrollbar"
                  placeholder="Enter global system prompt..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="glass rounded-2xl p-4 border border-slate-800/60 bg-slate-900/30">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-1 text-slate-500">Flow ID</p>
                  <p className="text-xs font-mono text-slate-400 truncate">{data?.conversation_flow_id}</p>
                </div>
                <div className="glass rounded-2xl p-4 border border-slate-800/60 bg-slate-900/30">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-1 text-slate-500">Current Status</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live & Active
                  </p>
                </div>
                <div className="glass rounded-2xl p-4 border border-slate-800/60 bg-slate-900/30">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-1 text-slate-500">Engine Version</p>
                  <p className="text-xs font-bold text-brand-primary">v{data?.version}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PromptSettings;
