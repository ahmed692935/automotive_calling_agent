import { FiDownload } from "react-icons/fi";
// import Logo from "../../../public/images/sumaLogo.png";
import { useForm, type SubmitHandler } from "react-hook-form";
import { TiArrowRight } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess } from "../../store/slices/authSlice";
import { loginUser } from "../../api/auth";
import type { SignInData } from "../../interfaces/auth";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInData>();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const onSubmit: SubmitHandler<SignInData> = async (data: SignInData) => {
    console.log(data, "Data");
    try {
      dispatch(loginStart());
      const response = await loginUser(data);
      console.log(response, "LOGIN RESPONSE");

      // ✅ Extract token + user from API response
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
    }
  };

  const handleNavigate = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl p-5 md:p-8 w-full max-w-md text-center m-5 md:p-0"
      >
        {/* Rotated Download Icon */}
        <div className="flex justify-center mb-5 mt-5">
          {/* <div className="bg-gradient-to-l from-[#05A3A9] to-[#6BEE2E] p-2 rounded-lg shadow-lg"> */}
          {/* <div>
            <img src={Logo} width={150}></img>
          </div> */}
          <div className="bg-gradient-to-r from-[#6d0f78] to-[#0a0f2d] p-2 rounded-lg shadow-lg">
            <FiDownload className="text-white text-4xl rotate-270" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in</h2>
        <p className="text-gray-500 text-base mb-6 leading-tight">
          Welcome back! Please sign in to your account
        </p>

        {/* Email */}
        <label className=" block mb-5 font-normal text-left">
          {" "}
          Email
          <input
            type="email"
            placeholder="You@example.com"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 mb-1 border border-gray-300 mt-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 placeholder-gray-300"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
          )}
        </label>

        {/* Password */}
        <label className=" block mb-8 font-normal text-left">
          {" "}
          Password
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-1 focus:ring-purple-400 placeholder-gray-300"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-5">
              {errors.password.message}
            </p>
          )}
        </label>

        {/* Sign In Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6d0f78] to-[#0a0f2d] text-white py-2 rounded-lg transition-all cursor-pointer"
        >
          Sign In
          <TiArrowRight size={24} className="mt-1" />
        </button>

        {/* Bottom text */}
        <p className="mt-4 text-sm text-gray-500">
          Don’t have an account?{" "}
          <button
            // className="text-green-600 cursor-pointer hover:underline"
            className="text-purple-600 cursor-pointer hover:underline"
            onClick={handleNavigate}
          >
            Create one
          </button>
        </p>
        {loading && <p className="text-red-500 mt-5">Signing In...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default SignIn;
