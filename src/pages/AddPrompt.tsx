import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiCheck, FiTerminal, FiMessageSquare, FiLoader } from "react-icons/fi";
import { updateSystemPrompt, getSystemPrompt } from "../api/Call";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface SystemPromptResponse {
  system_prompt: string;
}

interface UpdatePromptPayload {
  system_prompt: string;
}

const AddPrompt = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [savedPrompt, setSavedPrompt] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "mock-token";
        if (!token) return;

        const response: SystemPromptResponse = await getSystemPrompt(token);
        if (response?.system_prompt) {
          setSavedPrompt(response.system_prompt);
        }
      } catch (error) {
        console.error("Failed to fetch prompt:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, []);

  const handleAddOrUpdate = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token") || "mock-token";
      if (!token) return;

      setIsSubmitting(true);
      const data: UpdatePromptPayload = { system_prompt: prompt.trim() };
      await updateSystemPrompt(data, token);

      setSavedPrompt(prompt.trim());
      setPrompt("");
      setIsEditing(false);
      toast.success("Prompt system updated successfully!");
    } catch (err) {
      const error = err as AxiosError<{
        detail?: { msg: string }[];
        message?: string;
        error?: string;
      }>;

      const message =
        error.response?.data?.detail?.[0]?.msg ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Oops! An unexpected error occurred.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPrompt = (): void => {
    setPrompt(savedPrompt);
    setIsEditing(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight">
          <span className="text-white">Prompt </span>
          <span className="text-gradient">Manager</span>
        </h1>
        <p className="text-slate-400 font-medium max-w-xl mx-auto">
          Define the personality and objective of your AI agent. You can manage one active system instruction at a time.
        </p>
      </motion.div>

      {/* Editor Section */}
      <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <FiTerminal size={120} className="text-brand-primary" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
              <FiMessageSquare size={18} />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider text-[10px]">Instruction Set</h3>
          </div>

          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              placeholder="e.g. You are a professional automotive sales assistant. Your goal is to schedule a test drive for the new Model X..."
              className="w-full bg-slate-900/50 border border-slate-700/50 text-slate-200 rounded-3xl p-6 outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all placeholder:text-slate-600 resize-none font-medium text-sm leading-relaxed"
            />
            <div className="absolute bottom-4 right-6 text-[10px] font-black text-slate-700 uppercase tracking-widest">
              Live Compiler
            </div>
          </div>

          <motion.button
            onClick={handleAddOrUpdate}
            disabled={!prompt.trim() || isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 btn-gradient text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20 transition-all cursor-pointer ${
              !prompt.trim() || isSubmitting ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <FiLoader className="animate-spin" size={20} />
            ) : isEditing ? (
              <FiCheck size={18} />
            ) : (
              <FiPlus size={18} />
            )}
            {isSubmitting ? "Deploying Instructions..." : isEditing ? "Synchronize Prompt" : "Deploy Prompt"}
          </motion.button>
        </div>
      </motion.div>

      {/* Saved Prompts Section */}
      <motion.div variants={itemVariants} className="glass rounded-[2.5rem] overflow-hidden border-slate-800/50 shadow-2xl">
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-secondary/10 rounded-lg text-brand-secondary">
              <FiTerminal size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Active System Prompt</h2>
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
            Production Ready
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Configuration Details</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[2px] text-center w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {loading ? (
                <tr>
                  <td colSpan={2} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Retrieving data...</p>
                    </div>
                  </td>
                </tr>
              ) : savedPrompt ? (
                <tr className="group hover:bg-slate-800/20 transition-colors">
                  <td className="px-10 py-8">
                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl text-sm text-slate-300 leading-relaxed font-medium transition-all group-hover:border-slate-700">
                      {savedPrompt}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <button
                      onClick={handleEditPrompt}
                      className="p-4 glass rounded-2xl text-brand-primary hover:text-white hover:bg-brand-primary/20 transition-all active:scale-90"
                      title="Edit Configuration"
                    >
                      <FiEdit2 size={18} />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={2} className="py-20 text-center">
                    <div className="text-slate-600 italic font-medium">No system instructions deployed yet.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddPrompt;
