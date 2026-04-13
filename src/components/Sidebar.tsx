import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  PhoneCall,
  FileEdit,
  LogOut,
  ChevronRight
} from "lucide-react";
import type { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import SumaLogo from "/images/SumaWhite.jpeg";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Initiate Call", path: "/call", icon: <PhoneCall size={18} /> },
    { label: "Add Prompt", path: "/add-prompt", icon: <FileEdit size={18} /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItemVariants = {
    hover: { x: 5, color: "#0ea5e9" },
    tap: { scale: 0.95 }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-4 sm:px-8 py-3 ${isScrolled ? "glass-nav py-2 shadow-2xl" : "bg-transparent py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
          <img
            src={SumaLogo}
            alt="Suma Logo"
            className="h-8 sm:h-10 w-auto object-contain rounded-lg shadow-lg"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 overflow-hidden group ${isActive
                        ? "text-brand-primary bg-brand-primary/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                      }`}
                  >
                    {item.icon}
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-primary"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="h-6 w-[1px] bg-slate-800" />

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-tighter">
                {user?.username || "Agent"}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Online</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all shadow-xl group"
              title="Logout"
            >
              <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl glass border-slate-700/50 text-slate-200"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[90]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm glass z-[100] p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <img src={SumaLogo} alt="Logo" className="h-8 rounded-lg" />
                <button onClick={() => setMenuOpen(false)} className="p-2 glass rounded-lg text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div key={item.path} variants={navItemVariants} whileHover="hover" whileTap="tap">
                      <Link
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all ${isActive
                            ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                            : "text-slate-400 hover:bg-slate-800/40"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          {item.icon}
                          {item.label}
                        </div>
                        <ChevronRight size={16} className={isActive ? "opacity-100" : "opacity-0"} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-auto border-t border-slate-800 pt-6">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-rose-500/20 transition-all cursor-pointer"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
