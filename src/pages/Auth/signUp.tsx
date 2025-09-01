import { FiDownload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { TiArrowRight } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import type { SignupData } from "../../interfaces/auth";
import {
  //   signupFailure,
  //   signupStart,
  signupSuccess,
} from "../../store/slices/authSlice";
import { signupUser } from "../../api/auth";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import toast from "react-hot-toast";

const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  console.log(user, "user");

  const {
    register,
    handleSubmit,
    formState: { errors },
    // watch,
    reset,
  } = useForm<SignupData>();

  const onSubmit = async (data: SignupData) => {
    console.log(data, "DATA SIGNUP");
    try {
      //   dispatch(signupStart());
      const response = await signupUser(data);
      console.log(response, "RESPONSE");
      dispatch(signupSuccess(response));
      toast.success("Sign-up successful! Please Sign in");
      reset();
      navigate("/");
    } catch (err: unknown) {
      //   dispatch(signupFailure(err.message));
      toast.error("Sign-up failed. Please try again");
      console.log(err);
    }
  };

  //   const onSubmit: SubmitHandler<SignInFormInputs> = (data) => {
  //     console.log("Form Submitted:", data);
  //     reset();
  //   };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  // const passwordValue = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl p-5 md:p-8 w-full max-w-md text-center m-5 md:p-0"
      >
        {/* Rotated Download Icon */}
        <div className="flex justify-center mb-5 mt-5">
          {/* <div className="bg-gradient-to-l bg-gradient-to-l from-[#05A3A9] to-[#6BEE2E] p-2 rounded-lg shadow-lg"> */}
          <div className="bg-gradient-to-r from-[#6d0f78] to-[#0a0f2d] p-2 rounded-lg shadow-lg">
            <FiDownload className="text-white text-4xl rotate-270" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-2">Sign up</h2>
        <p className="text-gray-500 text-base mb-6 leading-tight">
          Welcome! Please create your account
        </p>

        {/*Username*/}
        <label className=" block mb-5 font-normal text-left">
          {" "}
          Username
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: "Email is required" })}
            className="w-full px-4 py-2 mb-1 border border-gray-300 mt-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 placeholder-gray-300"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
          )}
        </label>

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

        {/* Confirm Password */}
        {/* <label className=" block mb-8 font-normal text-left">
          {" "}
          Confirm Password
          <input
            type="password"
            placeholder="Password"
            {...register("confirm_password", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === passwordValue || "Passwords do not match",
            })}
            className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-1 focus:ring-purple-400 placeholder-gray-300"
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm mb-5">
              {errors.confirm_password.message}
            </p>
          )}
        </label> */}

        {/* Sign In Button */}
        <button
          type="submit"
          className="w-full cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-[#6d0f78] to-[#0a0f2d] text-white py-2 rounded-lg transition-all"
        >
          Sign Up
          <TiArrowRight size={24} className="mt-1" />
        </button>

        {/* Bottom text */}
        <p className="mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <button
            className="text-purple-600 cursor-pointer hover:underline"
            onClick={handleNavigate}
          >
            Sign in
          </button>
        </p>
        {loading && <p className="text-blue-500">Signing up...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;
