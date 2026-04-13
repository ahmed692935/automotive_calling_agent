import { useForm } from "react-hook-form";
import type { CallFormInputs } from "../interfaces/callForm";
import {
  createCallFailure,
  createCallStart,
  createCallSuccess,
  resetCall,
  setTranscript,
  togglePopup,
} from "../store/slices/callForm";
import { useDispatch, useSelector } from "react-redux";
import { checkCallStatus, initiateCall } from "../api/Call";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { IoCall } from "react-icons/io5";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  Mic,
  ArrowRight,
  Loader2,
  PhoneForwarded,
  CheckCircle2
} from "lucide-react";

function CallForm() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: loading },
    reset,
    watch,
  } = useForm<CallFormInputs>({
    defaultValues: {
      caller_name: user?.username || "",
      caller_email: user?.email || "",
      caller_number: "",
      outbound_number: "",
      objective: "",
      context: "",
      language: "en",
      voice: "",
    },
  });

  const token = useSelector(
    (state: RootState) => state.auth.user?.access_token || "mock-token"
  );

  const { callId, openPopup, status } = useSelector(
    (state: RootState) => state.call
  );

  const onSubmit = async (values: CallFormInputs) => {
    try {
      dispatch(resetCall());
      dispatch(createCallStart());
      if (!token) throw new Error("No token found. Please login again.");

      const res = await initiateCall(values, token);
      dispatch(createCallSuccess(res));

      localStorage.setItem("lastCallId", res.call_id);
      localStorage.setItem("callerEmail", values.caller_email);
      toast.success("Call transmission localized. Connecting...");
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error?.response?.data?.error || "Oops an error occurred");
      dispatch(createCallFailure(error.message));
    }
  };

  const handlePoll = async (id: string, interval?: number) => {
    if (!token) return;
    try {
      const res = await checkCallStatus(id, token);
      dispatch(setTranscript(res));

      if (
        res.status === "completed" ||
        res.status === "busy" ||
        res.status === "ended" ||
        res.status === "unanswered" ||
        res.status === "no-answer"
      ) {
        if (interval) clearInterval(interval);
        toast.success(`Call ended with status: ${res.status}`);
        setTimeout(() => {
          dispatch(togglePopup(false));
          navigate("/dashboard");
          reset();
        }, 1500);
      }
    } catch (err) {
      console.error("Polling failed", err);
    }
  };

  useEffect(() => {
    let interval: number;
    if (openPopup && callId) {
      interval = setInterval(() => {
        handlePoll(callId, interval);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [openPopup, callId, token]);

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
      className="max-w-4xl mx-auto pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-black tracking-tight leading-tight">
          <span className="text-white">Let AI Handle </span>
          <span className="text-gradient">Your Next Call</span>
        </h1>
        <p className="text-slate-400 font-medium max-w-lg mx-auto">
          Scale your outreach program with intelligent, lifelike AI agents that handle logistics and support.
        </p>
      </motion.div>

      {/* Form Container */}
      <motion.div variants={itemVariants} className="glass rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <PhoneForwarded size={160} className="text-brand-primary" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-8">
          {/* Identity Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Your Identity</label>
              <div className="relative group/input">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-brand-primary transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("caller_name", { required: "Name is required" })}
                  className="w-full bg-slate-900/40 border border-slate-700/40 text-white pl-14 pr-6 py-4 rounded-2xl outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all placeholder:text-slate-600 font-medium"
                />
              </div>
              {errors.caller_name && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.caller_name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Confirmation Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-brand-primary transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register("caller_email", {
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
                  })}
                  className="w-full bg-slate-900/40 border border-slate-700/40 text-white pl-14 pr-6 py-4 rounded-2xl outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all placeholder:text-slate-600 font-medium"
                />
              </div>
              {errors.caller_email && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.caller_email.message}</p>}
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Destination Number</label>
            <div className="relative group/input">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-brand-primary transition-colors" size={18} />
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                {...register("outbound_number", {
                  required: "Number is required",
                  pattern: { value: /^\+?[1-9]\d{1,14}$/, message: "Enter a valid E.164 number" }
                })}
                className="w-full bg-slate-900/40 border border-slate-700/40 text-white pl-14 pr-6 py-4 rounded-2xl outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all placeholder:text-slate-600 font-medium tracking-widest"
              />
            </div>
            {errors.outbound_number && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.outbound_number.message}</p>}
          </div>

          {/* Context */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Call Context & Prompt Override</label>
            <div className="relative group/input">
              <MessageSquare className="absolute left-5 top-6 text-slate-500 group-focus-within/input:text-brand-primary transition-colors" size={18} />
              <textarea
                rows={4}
                placeholder="Specific instructions for this call session..."
                {...register("context", { required: "Context is required" })}
                className="w-full bg-slate-900/40 border border-slate-700/40 text-white pl-14 pr-6 py-5 rounded-[2rem] outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all placeholder:text-slate-600 font-medium leading-relaxed resize-none"
              />
            </div>
            {errors.context && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.context.message}</p>}
          </div>

          {/* Settings Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Target Language</label>
              <div className="relative group/input">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-brand-primary transition-colors" size={18} />
                <select
                  {...register("language")}
                  className="w-full appearance-none bg-slate-900/40 border border-slate-700/40 text-slate-200 pl-14 pr-10 py-4 rounded-2xl outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-sm cursor-pointer"
                >
                  <option value="en" className="bg-slate-900 text-white">English (US/UK)</option>
                  <option value="es" className="bg-slate-900 text-white">Spanish (LATAM/ES)</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <ArrowRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Agent Personality</label>
              <div className="relative group/input">
                <Mic className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-brand-primary transition-colors" size={18} />
                <select
                  {...register("voice", { required: "Agent selection required" })}
                  className="w-full appearance-none bg-slate-900/40 border border-slate-700/40 text-slate-200 pl-14 pr-10 py-4 rounded-2xl outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-sm cursor-pointer"
                >
                  {watch("language") === "es" ? (
                    <>
                      <option value="" className="bg-slate-900">Select Spanish Agent</option>
                      <option value="julio" className="bg-slate-900 text-blue-400">Julio - Professional Male</option>
                      <option value="donato" className="bg-slate-900 text-blue-400">Donato - Dynamic Male</option>
                      <option value="helena-spanish" className="bg-slate-900 text-pink-400">Helena - Soft Female</option>
                      <option value="rosa" className="bg-slate-900 text-pink-400">Rosa - Friendly Female</option>
                      <option value="mariam" className="bg-slate-900 text-pink-400">Mariam - Formal Female</option>
                    </>
                  ) : (
                    <>
                      <option value="" className="bg-slate-900">Select English Agent</option>
                      <option value="david" className="bg-slate-900 text-blue-400">David - Senior Male</option>
                      <option value="ravi" className="bg-slate-900 text-blue-400">Ravi - Friendly Male</option>
                      <option value="emily-british" className="bg-slate-900 text-pink-400">Emily - British Female</option>
                      <option value="alice-british" className="bg-slate-900 text-pink-400">Alice - Formal British</option>
                      <option value="julia-british" className="bg-slate-900 text-pink-400">Julia - Energetic British</option>
                    </>
                  )}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <ArrowRight size={14} className="rotate-90" />
                </div>
              </div>
              {errors.voice && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.voice.message}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -15px rgba(14, 165, 233, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-5 btn-gradient text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-4 transition-all ${loading ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <PhoneCall size={20} strokeWidth={3} />
              )}
              {loading ? "Establishing Secure Link..." : "Initiate AI Outreach"}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Modern Pop-up Overlay */}
      <AnimatePresence>
        {openPopup && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative glass rounded-[3rem] p-10 w-full max-w-lg text-center shadow-2xl overflow-hidden"
            >
              {/* Animated Background Pulse */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 space-y-8">
                <div className="flex justify-center flex-col items-center">
                  <div className="relative mb-8">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-brand-primary opacity-20"
                    />
                    <div className="w-24 h-24 rounded-full bg-brand-primary/10 border-2 border-brand-primary flex items-center justify-center text-brand-primary shadow-2xl relative">
                      <IoCall size={40} className="animate-wiggle" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Call in Progress</h2>
                  <p className="text-slate-400 font-medium text-sm mt-2">Connecting to secure carrier network...</p>
                </div>

                <div className="space-y-4">
                  <div className="glass bg-slate-900/40 p-5 rounded-3xl flex items-center justify-between group">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Session Identifier</span>
                    <span className="text-xs font-mono text-brand-primary font-bold group-hover:scale-110 transition-transform">{callId}</span>
                  </div>

                  <div className="glass bg-brand-primary/5 p-5 rounded-3xl flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Real-time Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wider animate-pulse">
                        {status || "Synchronizing..."}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => callId && handlePoll(callId)}
                    className="w-full py-4 glass text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all border-slate-700"
                  >
                    <CheckCircle2 size={18} className="text-brand-primary" />
                    Synchronize Status
                  </motion.button>

                  <button
                    onClick={() => dispatch(togglePopup(false))}
                    className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-rose-400 transition-colors py-2"
                  >
                    Minimize Session
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const PhoneCall = ({ size, strokeWidth }: { size?: number, strokeWidth?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth || 2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default CallForm;
