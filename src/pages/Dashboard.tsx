import { useEffect, useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from "react";
import type {
  DashboardReportsResponse,
  RowData,
  Transcript,
} from "../interfaces/dashboard";
import { FiCheckCircle, FiPhone, FiXCircle, FiPlay, FiInfo, FiLayers } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchCallHistory,
  fetchDashboardCallById,
  fetchDashboardReports,
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
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [reports, setReports] = useState<DashboardReportsResponse | null>(null);
  const [openRecordingModal, setOpenRecordingModal] = useState(false);
  const [currRecordingUrl, setCurrRecordingUrl] = useState<string | null>(null);

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

  useEffect(() => {
    const loadReports = async () => {
      if (!token) return;
      setReportsLoading(true);
      setReportsError(null);
      try {
        const data = await fetchDashboardReports(token, 7);
        setReports(data);
      } catch (err: unknown) {
        let errorMessage = "Failed to fetch dashboard reports";
        if (err instanceof Error) errorMessage = err.message;
        setReportsError(errorMessage);
      } finally {
        setReportsLoading(false);
      }
    };
    loadReports();
  }, [token]);

  useEffect(() => {
    if (reportsError) {
      toast.error(reportsError);
    }
  }, [reportsError]);

  const normalizeTranscript = (
    transcript: string | Transcript | null | undefined
  ): Transcript | null => {
    if (!transcript) return null;
    if (typeof transcript !== "string") return transcript;

    const items = transcript
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const agentPrefix = "Agent:";
        const callerPrefix = "Caller:";

        if (line.startsWith(agentPrefix)) {
          return {
            role: "assistant",
            content: line.slice(agentPrefix.length).trim(),
          };
        }

        if (line.startsWith(callerPrefix)) {
          return {
            role: "user",
            content: line.slice(callerPrefix.length).trim(),
          };
        }

        return {
          role: "assistant",
          content: line,
        };
      });

    return {
      items,
      note: "",
    };
  };

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
      const data = await fetchDashboardCallById(row.call_id, token);
      setSelectedRow((prev) =>
        prev
          ? {
              ...prev,
              call_id: data.call_id ?? prev.call_id,
              status: data.status ?? prev.status,
              started_at: data.started_at ?? prev.started_at,
              ended_at: data.ended_at ?? prev.ended_at,
              duration: data.duration ?? prev.duration,
              recording_url: data.recording_url ?? prev.recording_url,
               agent_phone: data.agent_phone ?? prev.agent_phone,
               caller_phone: data.caller_phone ?? prev.caller_phone,
               transcript: normalizeTranscript(data.transcript || row.transcript_text),
               summary: data.summary ?? prev.summary,
             }
           : {
               ...row,
               call_id: data.call_id ?? row.call_id,
               status: data.status ?? row.status,
               started_at: data.started_at ?? row.started_at,
               ended_at: data.ended_at ?? row.ended_at,
               duration: data.duration ?? row.duration,
               recording_url: data.recording_url ?? row.recording_url,
               agent_phone: data.agent_phone ?? row.agent_phone,
               caller_phone: data.caller_phone ?? row.caller_phone,
               transcript: normalizeTranscript(data.transcript || row.transcript_text),
               summary: data.summary ?? row.summary,
             }
      );
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error?.response?.data?.error || "Failed to load call details");
    } finally {
      setTranscriptLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  const handleListenRecording = (url: string | null) => {
    if (!url) {
      toast.error("Recording URL not available");
      return;
    }
    setCurrRecordingUrl(url);
    setOpenRecordingModal(true);
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

      {/* Reports Section */}
      <motion.div variants={itemVariants} className="glass rounded-[2.5rem] overflow-hidden border-slate-800/50 shadow-2xl">
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
              <FiLayers size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Reports ({reports?.period_days ?? 7} days)</h2>
          </div>
          {reportsLoading ? (
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading...</span>
          ) : null}
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Calls", value: reports?.summary.total_calls ?? 0 },
              { label: "Appointments", value: reports?.summary.total_appointments ?? 0 },
              { label: "Total Minutes", value: reports?.summary.total_minutes?.toFixed(2) ?? "0.00" },
              { label: "Successful", value: reports?.summary.successful_calls ?? 0 },
              { label: "Unanswered", value: reports?.summary.unanswered_calls ?? 0 },
              { label: "Repeat Callers", value: reports?.summary.repeat_callers ?? 0 },
              { label: "New Callers", value: reports?.summary.new_callers ?? 0 },
            ].map((metric) => (
              <div key={metric.label} className="glass rounded-2xl p-4 border border-slate-800/60">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-2">{metric.label}</p>
                <p className="text-2xl font-black text-white tracking-tight">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-5 border border-slate-800/60">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-4">Calls Over Time</p>
              <div className="space-y-2">
                {reports?.calls_over_time?.length ? (
                  reports.calls_over_time.map((point) => (
                    <div key={point.date} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{point.date}</span>
                      <span className="text-white font-bold">{point.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm italic">No data available</p>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-5 border border-slate-800/60">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-4">Appointments Over Time</p>
              <div className="space-y-2">
                {reports?.appointments_over_time?.length ? (
                  reports.appointments_over_time.map((point) => (
                    <div key={point.date} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{point.date}</span>
                      <span className="text-white font-bold">{point.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm italic">No data available</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-5 border border-slate-800/60">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-4">Top Repeat Callers</p>
              <div className="space-y-2">
                {reports?.top_repeat_callers?.length ? (
                  reports.top_repeat_callers.map((caller) => (
                    <div key={caller.phone} className="flex items-center justify-between gap-4 text-sm">
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate">
                          {caller.name?.trim() ? caller.name : "Unknown"}
                        </p>
                        <p className="text-slate-500 text-xs">{caller.phone}</p>
                      </div>
                      <span className="text-brand-primary font-black">{caller.call_count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm italic">No repeat callers yet</p>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-5 border border-slate-800/60">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-4">Sentiment Breakdown</p>
              <div className="space-y-2">
                {Object.entries(reports?.sentiment_breakdown ?? {}).length ? (
                  Object.entries(reports?.sentiment_breakdown ?? {}).map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 capitalize">{label}</span>
                      <span className="text-white font-bold">{value ?? 0}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm italic">No sentiment data available</p>
                )}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 border border-slate-800/60">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-4">Appointment Status Distribution</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(reports?.summary.appointment_status_distribution ?? {}).length ? (
                Object.entries(reports?.summary.appointment_status_distribution ?? {}).map(([label, value]) => (
                  <div key={label} className="bg-slate-900/60 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-slate-400 text-sm capitalize">{label.replaceAll("_", " ")}</span>
                    <span className="text-white font-black">{value}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm italic">No appointment status data available</p>
              )}
            </div>
          </div>
        </div>
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
                {["Call ID", "Duration", "Phone Number", "Status", "Started At", "Recording", "Action"].map((h) => (
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
                    key={row.call_id}
                    className="group hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="font-bold text-white">#{row.call_id.slice(-6).toUpperCase()}</div>
                      <div className="text-xs text-slate-500">{row.call_id}</div>
                    </td>
                    <td className="px-8 py-6 text-sm font-semibold text-slate-300 capitalize">
                      {row.duration ? `${Math.floor(row.duration / 60)}m ${Math.floor(row.duration % 60)}s` : "0s"}
                    </td>
                    <td className="px-8 py-6 text-sm font-mono text-slate-400">{row.caller_phone || "N/A"}</td>
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
                        onClick={() => handleListenRecording(row.recording_url)}
                        className="flex items-center gap-2 text-brand-primary text-xs font-bold hover:text-white transition-colors group/btn"
                      >
                        <FiPlay className="group-hover/btn:scale-125 transition-transform" />
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
            className="px-6 py-2 glass rounded-xl text-sm font-bold disabled:opacity-30 hover:bg-slate-800/60 transition-all active:scale-95"
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
            className="px-6 py-2 glass rounded-xl text-sm font-bold disabled:opacity-30 hover:bg-slate-800/60 transition-all active:scale-95"
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
                  { label: "Agent", val: selectedRow.agent_phone || "AI Agent" },
                  { label: "Phone", val: selectedRow.caller_phone || "N/A" },
                  { label: "Status", val: selectedRow.status },
                  { label: "Duration", val: selectedRow.duration ? `${Math.floor(selectedRow.duration / 60)}m ${Math.floor(selectedRow.duration % 60)}s` : "0s" },
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
                        selectedRow.transcript.items.map((item: { role: string; content: string | number | bigint | boolean | any[] | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, idx: Key | null | undefined) => (
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

      {/* Recording Player Modal */}
      <AnimatePresence>
        {openRecordingModal && currRecordingUrl && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setOpenRecordingModal(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-slate-900/90 border border-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden glass p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                    <FiPlay size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Playback</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Call Recording</p>
                  </div>
                </div>
                <button 
                  onClick={() => setOpenRecordingModal(false)} 
                  className="p-3 glass rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-slate-950/40 rounded-3xl p-6 border border-slate-800 mb-8 mt-4">
                <audio 
                  controls 
                  autoPlay
                  src={currRecordingUrl} 
                  className="w-full h-12 accent-brand-primary"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>

              <button
                onClick={() => setOpenRecordingModal(false)}
                className="w-full py-4 btn-gradient text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/20 active:scale-95"
              >
                Done Listening
              </button>
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
