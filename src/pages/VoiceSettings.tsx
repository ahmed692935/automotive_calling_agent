import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiMusic, FiCheck, FiPlay, FiSettings, FiMic } from "react-icons/fi";
import toast from "react-hot-toast";
import type { RootState } from "../store/store";
import { getVoices, updateVoice } from "../api/retell";
import type { Voice, VoicesResponse } from "../interfaces/voice";
import { Mic2 } from "lucide-react";

const VoiceSettings = () => {
  const [data, setData] = useState<VoicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audio] = useState(new Audio());

  const token = useSelector((state: RootState) => state.auth.user?.access_token);

  const fetchVoices = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getVoices(token);
      setData(res);
    } catch (err: any) {
      toast.error("Failed to fetch voices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoices();
  }, [token]);

  const handlePlayPreview = (voice: Voice) => {
    if (playingId === voice.voice_id) {
      audio.pause();
      setPlayingId(null);
    } else {
      audio.src = voice.preview_audio_url;
      audio.play();
      setPlayingId(voice.voice_id);
      audio.onended = () => setPlayingId(null);
    }
  };

  const handleSelectVoice = async (voiceId: string) => {
    if (!token) return;
    try {
      setUpdatingId(voiceId);
      await updateVoice(token, { voice_id: voiceId });
      toast.success("Voice updated successfully");
      setData((prev) => prev ? { ...prev, current_voice_id: voiceId } : null);
    } catch (err: any) {
      toast.error("Failed to update voice");
    } finally {
      setUpdatingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="glass rounded-[2.5rem] overflow-hidden border-slate-800/50 shadow-2xl">
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
              <Mic2 size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Available Voices</h2>
          </div>
          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Syncing</span>
            </div>
          )}
        </div>

        <div className="p-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 glass rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {data?.voices.map((voice) => {
                  const isCurrent = data.current_voice_id === voice.voice_id;
                  const isUpdating = updatingId === voice.voice_id;
                  const isPlaying = playingId === voice.voice_id;

                  return (
                    <motion.div
                      layout
                      key={voice.voice_id}
                      className={`relative group rounded-3xl p-6 transition-all duration-500 border overflow-hidden ${
                        isCurrent 
                          ? "bg-brand-primary/10 border-brand-primary/50 shadow-[0_0_20px_rgba(14,165,233,0.1)]" 
                          : "glass border-slate-800/60 hover:border-slate-700"
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-brand-primary text-white rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg z-10">
                          <FiCheck size={10} />
                          Active
                        </div>
                      )}

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`p-4 rounded-2xl ${isCurrent ? "bg-brand-primary text-white" : "bg-slate-900 border border-slate-800 text-slate-400"} transition-colors`}>
                            <FiMic size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-white leading-tight">{voice.voice_name}</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{voice.provider}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-6">
                          <div className="px-3 py-2 bg-slate-950/40 rounded-xl border border-slate-800/40">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Accent</p>
                            <p className="text-xs font-bold text-slate-300">{voice.accent}</p>
                          </div>
                          <div className="px-3 py-2 bg-slate-950/40 rounded-xl border border-slate-800/40">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Gender</p>
                            <p className="text-xs font-bold text-slate-300">{voice.gender}</p>
                          </div>
                        </div>

                        <div className="mt-auto flex gap-3">
                          <button
                            onClick={() => handlePlayPreview(voice)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs transition-all active:scale-95 ${
                              isPlaying 
                                ? "bg-white text-brand-primary " 
                                : "glass text-white hover:bg-slate-800"
                            }`}
                          >
                            {isPlaying ? (
                              <>
                                <div className="flex gap-0.5 items-end h-3">
                                  <div className="w-0.5 bg-brand-primary animate-[bounce_0.6s_infinite]" style={{ height: '60%' }} />
                                  <div className="w-0.5 bg-brand-primary animate-[bounce_0.8s_infinite]" style={{ height: '100%' }} />
                                  <div className="w-0.5 bg-brand-primary animate-[bounce_0.7s_infinite]" style={{ height: '80%' }} />
                                </div>
                                Playing
                              </>
                            ) : (
                              <>
                                <FiPlay size={14} />
                                Preview
                              </>
                            )}
                          </button>
                          
                          <button
                            disabled={isCurrent || isUpdating}
                            onClick={() => handleSelectVoice(voice.voice_id)}
                            className={`px-6 py-3 rounded-2xl font-bold text-xs transition-all active:scale-95 shadow-xl ${
                              isCurrent 
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                                : "btn-gradient text-white shadow-brand-primary/20"
                            }`}
                          >
                            {isUpdating ? "..." : isCurrent ? "Selected" : "Select"}
                          </button>
                        </div>
                      </div>

                      <FiMusic className={`absolute -bottom-4 -right-4 text-9xl opacity-[0.03] pointer-events-none transition-transform duration-700 ${isPlaying ? 'scale-110 rotate-12 opacity-[0.07]' : 'group-hover:scale-105 group-hover:rotate-6'}`} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VoiceSettings;
