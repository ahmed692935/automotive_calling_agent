import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess } from "../../store/slices/authSlice";
import { loginUser } from "../../api/auth";
import type { SignInData } from "../../interfaces/auth";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// const SumaLogo = "/images/sumaLogo.png";
const SumaLogo = "/images/SUMA_BlackLogo.svg"

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInData>();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loginLoading } = useSelector((state: RootState) => state.auth);

  const onSubmit: SubmitHandler<SignInData> = async (data: SignInData) => {
    try {
      dispatch(loginStart());
      const response = await loginUser(data);
      const token = response.access_token;
      const user = { ...response.user, access_token: token };

      dispatch(loginSuccess({ user, token }));
      toast.success("Sign-in successful!");
      navigate("/dashboard");
      reset();
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error?.response?.data?.error || "Oops an error occurred");
      console.error(err);
    } finally {
      dispatch({ type: "auth/loginFailure", payload: null });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#f8fafc] p-6 overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 blur-[120px] rounded-full" />

      {/* Back to Home Link */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <div className="p-2 glass rounded-lg group-hover:bg-slate-800/50 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div variants={itemVariants} className="inline-block mb-6">
            <img src={SumaLogo} alt="Suma Logo" className="h-12 w-auto mx-auto rounded-xl shadow-2xl" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl font-black mb-2">
            <span className="text-slate-950">Welcome </span>
            <span className="text-gradient">Back</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-slate-400 text-sm">
            Please enter your details to sign in
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className="glass rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
          {/* Subtle glow effect on hover */}
          <div className="absolute -inset-px bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />

          <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-brand-primary transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email", { required: "Email is required" })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all placeholder:text-slate-600"
                />
              </div>
              {errors.email && (
                <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-slate-300">Password</label>
                <Link to="#" className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 transition-colors">Forgot?</Link>
              </div>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-brand-primary transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                  className="w-full bg-slate-900/50 border border-slate-700/50 text-white pl-12 pr-12 py-3.5 rounded-2xl outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-primary transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1 mt-1">{errors.password.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loginLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 btn-gradient text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20 transition-all cursor-pointer ${loginLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {loginLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            <p className="text-center text-slate-400 text-sm mt-8">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-brand-primary font-bold hover:underline underline-offset-4"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </button>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;