import { useEffect, useState } from "react";
import type { RowData } from "../interfaces/dashboard";
import { FiCheckCircle, FiPhone, FiXCircle, FiPlay, FiInfo, FiLayers } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchCallHistory,
  fetchCallTranscript,
  fetchRecordingStream,
} from "../api/dashboard";
import {
  fetchCallsFailure,
  fetchCallsStart,
  fetchCallsSuccess,
} from "../store/slices/dashboardSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [activeTab, setActiveTab] = useState<"transcription" | "summary">(
    "transcription"
  );
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [loadingRecordings, setLoadingRecordings] = useState<string | null>(
    null
  );

  const dispatch = useDispatch<AppDispatch>();
  const { calls, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const token = useSelector(
    (state: RootState) => state.auth.user?.access_token
  );
  const pagination = useSelector(
    (state: RootState) => state.dashboard.pagination
  );

  const totalCalls = pagination?.total || 0;
  const totalPages = Math.ceil(totalCalls / pageSize);
  const successfulCalls = pagination?.completed_calls || 0;
  const queuedCalls = pagination?.not_completed_calls || 0;

  useEffect(() => {
    const loadHistory = async () => {
      if (token) {
        try {
          dispatch(fetchCallsStart());
          const data = await fetchCallHistory(token, currentPage, pageSize);
          dispatch(
            fetchCallsSuccess({
              calls: data.calls,
              pagination: data.pagination,
            })
          );
        } catch (err: unknown) {
          console.error("Failed to fetch call history:", err);
          let errorMessage = "Failed to fetch call history";
          if (err instanceof Error) errorMessage = err.message;
          dispatch(fetchCallsFailure(errorMessage));
        }
      }
    };
    loadHistory();
  }, [dispatch, token, currentPage]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleOpenModal = async (row: RowData) => {
    setSelectedRow(row);
    setActiveTab("transcription");
    setOpenModal(true);

    if (!token) {
      toast.error("Missing authentication token");
      return;
    }
    setTranscriptLoading(true);
    try {
      const data = await fetchCallTranscript(row.call_id, token);
      setSelectedRow((prev) =>
        prev
          ? { ...prev, transcript: data.transcript }
          : { ...row, transcript: data.transcript }
      );
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error?.response?.data?.error || "Failed to load transcript");
    } finally {
      setTranscriptLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  const handleListenRecording = async (callId: string) => {
    if (!token) {
      toast.error("Missing authentication token");
      return;
    }
    setLoadingRecordings(callId);
    try {
      const audioUrl = await fetchRecordingStream(callId, token);
      window.open(audioUrl, "_blank");
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error?.response?.data?.error || "Recording Not Found or wait sometime for proper loading");
    } finally {
      setLoadingRecordings(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
      className="space-y-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">
            <span className="text-white">Analytics </span>
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-slate-400 font-medium">Monitor and optimize your AI agent performance</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-2xl border-brand-primary/20">
          <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Real-time Insights</span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Total Calls", value: totalCalls, icon: <FiPhone />, color: "brand-primary" },
          { label: "Successful Calls", value: successfulCalls, icon: <FiCheckCircle />, color: "emerald-400" },
          { label: "Other States", value: queuedCalls, icon: <FiXCircle />, color: "rose-400" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="glass rounded-[2rem] p-8 flex items-center justify-between group hover:border-brand-primary/30 transition-all duration-500 hover:translate-y-[-5px]"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</h3>
              <p className="text-4xl font-black text-white tracking-tighter">{stat.value || 0}</p>
            </div>
            <div className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 text-${stat.color} group-hover:scale-110 transition-transform duration-500`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Table Section */}
      <motion.div variants={itemVariants} className="glass rounded-[2.5rem] overflow-hidden border-slate-800/50 shadow-2xl">
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
              <FiLayers size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Call Log</h2>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-slate-500 uppercase">Page {currentPage} of {totalPages || 1}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                {["User Info", "Agent", "Receiver", "Status", "Created At", "Recording", "Action"].map((h) => (
                  <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[2px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing data...</p>
                    </div>
                  </td>
                </tr>
              ) : calls?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-slate-500 font-medium italic">No call history found</td>
                </tr>
              ) : (
                calls?.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="font-bold text-white">{row.username}</div>
                      <div className="text-xs text-slate-500">{row.email}</div>
                    </td>
                    <td className="px-8 py-6 text-sm font-semibold text-slate-300 capitalize">{row.voice_name}</td>
                    <td className="px-8 py-6 text-sm font-mono text-slate-400">{row.to_number}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                        ${row.status === "completed" || row.status === "connected" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                          row.status === "busy" || row.status === "no-answer" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                          "bg-slate-800 text-slate-400 border border-slate-700"}
                      `}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs text-slate-400 font-medium">
                      {row.started_at ? new Date(row.started_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : "N/A"}
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => handleListenRecording(row.call_id)}
                        disabled={loadingRecordings === row.call_id}
                        className="flex items-center gap-2 text-brand-primary text-xs font-bold hover:text-white transition-colors group/btn"
                      >
                        {loadingRecordings === row.call_id ? (
                          <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiPlay className="group-hover/btn:scale-125 transition-transform" />
                        )}
                        Listen
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => handleOpenModal(row)}
                        className="p-2.5 glass rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all active:scale-95"
                      >
                        <FiInfo size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 bg-slate-900/40 border-t border-slate-800/50 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-6 py-2 glass rounded-xl text-sm font-bold disabled:opacity-30 hover:bg-slate-800/60 transition-all transition-all active:scale-95"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages || 1)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${currentPage === i + 1 ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "glass text-slate-500 hover:text-slate-300"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-6 py-2 glass rounded-xl text-sm font-bold disabled:opacity-30 hover:bg-slate-800/60 transition-all transition-all active:scale-95"
          >
            Next
          </button>
        </div>
      </motion.div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {openModal && selectedRow && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={handleCloseModal}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-slate-900/90 border border-slate-800 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden glass"
            >
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-brand-primary/10 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary shadow-inner">
                    <FiPhone size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Call Details</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{selectedRow.call_id}</p>
                  </div>
                </div>
                <button onClick={handleCloseModal} className="p-3 glass rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-900/30">
                {[
                  { label: "Agent", val: selectedRow.voice_name },
                  { label: "Phone", val: selectedRow.to_number },
                  { label: "Status", val: selectedRow.status },
                  { label: "Language", val: "English" },
                ].map((d, i) => (
                  <div key={i}>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-1">{d.label}</p>
                    <p className="text-sm font-bold text-slate-200 capitalize">{d.val}</p>
                  </div>
                ))}
              </div>

              <div className="flex border-b border-slate-800 bg-slate-900/40">
                {["transcription", "summary"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                      activeTab === tab ? "text-brand-primary" : "text-slate-500 hover:text-slate-300"
                    }`}
                    onClick={() => setActiveTab(tab as any)}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="modal-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-8 h-80 overflow-y-auto bg-slate-950/20">
                {transcriptLoading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Compiling history...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeTab === "transcription" ? (
                      selectedRow.transcript?.items?.length ? (
                        selectedRow.transcript.items.map((item, idx) => (
                          <div key={idx} className={`flex gap-4 ${item.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={`p-4 rounded-3xl max-w-[80%] ${item.role === 'assistant' ? 'glass bg-brand-primary/5 text-slate-200' : 'bg-slate-800/80 text-slate-300'}`}>
                              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">
                                {item.role === 'assistant' ? 'Agent' : 'User'}
                              </p>
                              <p className="text-sm leading-relaxed">{Array.isArray(item.content) ? item.content.join(" ") : item.content}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-600 italic text-center py-10">No transcript lines found.</p>
                      )
                    ) : (
                      <p className="text-slate-300 leading-relaxed font-medium">{selectedRow.summary || "Summary generated upon call completion."}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-slate-800 flex justify-center bg-slate-900/40">
                <button
                  onClick={handleCloseModal}
                  className="w-full md:w-auto px-10 py-3 btn-gradient text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/20 active:scale-95"
                >
                  Close Insights
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default Dashboard;
