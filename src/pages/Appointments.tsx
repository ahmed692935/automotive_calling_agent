import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getAppointments } from "../api/appointment";
import type { AppointmentsResponse, Appointment } from "../interfaces/appointment";
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiMail,  
  FiCheckCircle, 
  FiXCircle, 
  FiLayers,
  FiInfo
} from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Appointments = () => {
  const [data, setData] = useState<AppointmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const token = useSelector(
    (state: RootState) => state.auth.user?.access_token
  );

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await getAppointments(token, currentPage, pageSize);
        setData(response);
      } catch (error: any) {
        console.error("Failed to fetch appointments:", error);
        toast.error(error?.response?.data?.error || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, currentPage]);

  const totalPages = data ? Math.ceil(data.totals.total / pageSize) : 0;

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
            <span className="text-white">Customer </span>
            <span className="text-gradient">Appointments</span>
          </h1>
          <p className="text-slate-400 font-medium">Manage and track all scheduled customer visits</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-2xl border-brand-primary/20">
          <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Live Updates</span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total", value: data?.totals.total, icon: <FiLayers />, color: "brand-primary" },
          { label: "Scheduled", value: data?.totals.scheduled, icon: <FiCalendar />, color: "emerald-400" },
          { label: "Completed", value: data?.totals.completed, icon: <FiCheckCircle />, color: "blue-400" },
          { label: "Cancelled", value: data?.totals.cancelled, icon: <FiXCircle />, color: "rose-400" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="glass rounded-[2rem] p-8 flex items-center justify-between group hover:border-brand-primary/30 transition-all duration-500 hover:translate-y-[-5px]"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</h3>
              <p className="text-4xl font-black text-white tracking-tighter">{loading ? "..." : (stat.value || 0)}</p>
            </div>
            <div className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 text-${stat.color} group-hover:scale-110 transition-transform duration-500`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Appointments List */}
      <motion.div variants={itemVariants} className="glass rounded-[2.5rem] overflow-hidden border-slate-800/50 shadow-2xl">
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
              <FiCalendar size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Recent Appointments</h2>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-slate-500 uppercase">Page {currentPage} of {totalPages || 1}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                {["Customer", "Details", "Date & Time", "Status", "Action"].map((h) => (
                  <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[2px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading appointments...</p>
                    </div>
                  </td>
                </tr>
              ) : data?.appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-slate-500 font-medium italic">No appointments found</td>
                </tr>
              ) : (
                [...data!.appointments].reverse().map((apt: Appointment) => (
                  <tr
                    key={apt.id}
                    className="group hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-primary">
                          <FiUser size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-white">{apt.caller_name || "N/A"}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <FiMail size={12} /> {apt.caller_email || "No Email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-semibold text-slate-300">
                        {apt.title}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">
                        {apt.description || "No description"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-slate-300 flex items-center gap-2">
                        <FiCalendar size={14} className="text-brand-primary" />
                        {apt.appointment_date}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <FiClock size={14} />
                        {apt.start_time.slice(0, 5)} - {apt.end_time.slice(0, 5)}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                        ${apt.status === "scheduled" ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" : 
                          apt.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          apt.status === "cancelled" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                          "bg-slate-800 text-slate-400 border border-slate-700"}
                      `}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button
                        className="p-2.5 glass rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all active:scale-95"
                        title="View Details"
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
            disabled={currentPage === 1 || loading}
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
            disabled={currentPage === totalPages || totalPages === 0 || loading}
            className="px-6 py-2 glass rounded-xl text-sm font-bold disabled:opacity-30 hover:bg-slate-800/60 transition-all active:scale-95"
          >
            Next
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Appointments;