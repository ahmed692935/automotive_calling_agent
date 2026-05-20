import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, UserCircle, LogOut, LayoutDashboard } from "lucide-react";
import type { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import SumaBlack from "/images/SUMA_BlackLogo.svg"

function HeaderLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const menuItems = ["Home", "About", "Services", "Contact"];
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const navItemVariants = {
    hover: { scale: 1.05, color: "#2563eb" },
    tap: { scale: 0.95 }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-4 ${
        isScrolled 
          ? "glass-nav py-3 shadow-2xl" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={SumaBlack}
            alt="Suma Logo"
            className="h-8 sm:h-10 w-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {menuItems.map((item) => (
              <motion.li
                key={item}
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleScrollToSection(item.toLowerCase())}
                className="list-none cursor-pointer font-medium text-sm tracking-wide uppercase transition-colors"
                style={{ color: isScrolled ? "#475569" : "#334155" }}
              >
                {item}
              </motion.li>
            ))}
          </ul>

          <div className="h-6 w-[1px] bg-slate-700/50" />

          {/* User Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass border-slate-700/50 hover:border-brand-primary/50 transition-all"
                >
                  <UserCircle size={20} className="text-brand-primary" />
                  <span className="text-sm font-semibold max-w-[80px] truncate">
                    {user.email.split('@')[0]}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {openDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 glass rounded-2xl overflow-hidden shadow-2xl z-[110]"
                    >
                      <div className="p-3 border-b border-slate-700/50">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Signed in as</p>
                      <p className="text-xs font-semibold truncate text-slate-900">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => dispatch(logout())}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold hover:text-brand-primary transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 rounded-full btn-gradient text-white text-sm font-bold shadow-lg shadow-brand-primary/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl glass border-slate-700/50"
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
              className="fixed inset-0 bg-slate-950/30 backdrop-blur-md z-[90]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm glass z-[100] p-8 flex flex-col"
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setMenuOpen(false)} className="p-2 glass rounded-lg">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-8 flex-1">
                <ul className="flex flex-col gap-6">
                  {menuItems.map((item) => (
                    <li
                      key={item}
                      onClick={() => handleScrollToSection(item.toLowerCase())}
                      className="text-2xl font-bold text-slate-800 hover:text-brand-primary transition-colors cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-4">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="w-full py-4 glass rounded-2xl flex items-center justify-center gap-3 font-bold"
                      >
                        <LayoutDashboard size={20} />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => dispatch(logout())}
                        className="w-full py-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center gap-3 font-bold"
                      >
                        <LogOut size={20} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="w-full py-4 glass rounded-2xl flex items-center justify-center font-bold"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="w-full py-4 btn-gradient text-white rounded-2xl flex items-center justify-center font-bold"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default HeaderLanding;
