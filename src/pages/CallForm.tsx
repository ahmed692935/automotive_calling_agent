// src/components/CallForm.jsx
import { useForm } from "react-hook-form";
import type { CallFormInputs } from "../interfaces/callForm";
import {
  createCallFailure,
  createCallStart,
  createCallSuccess,
  setTranscript,
  togglePopup,
  //   togglePopup,
} from "../store/slices/callForm";
import { useDispatch, useSelector } from "react-redux";
import { checkCallStatus, initiateCall } from "../api/Call";
// import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import type { TranscriptLine } from "../interfaces/dashboard";
// import { useNavigate } from "react-router-dom";

function CallForm() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  //   const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CallFormInputs>({
    defaultValues: {
      caller_name: user?.username || "",
      caller_email: user?.email || "",
      caller_number: "",
      outbound_number: "",
      objective: "",
      context: "",
      language: "english",
      voice: "",
    },
  });
  const dispatch = useDispatch();
  //   const navigate = useNavigate();
  //   const [openPopup, setOpenPopup] = useState(false);
  //   const [callId, setCallId] = useState<string | null>(null);
  //   const [polling, setPolling] = useState<NodeJS.Timeout | null>(null);
  //   const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const token = useSelector(
    (state: RootState) => state.auth.user?.access_token
  );

  const { callId, openPopup, transcript, status } = useSelector(
    (state: RootState) => state.call
  );

  console.log(transcript, "call id");
  const navigate = useNavigate();

  const onSubmit = async (values: CallFormInputs) => {
    try {
      dispatch(createCallStart());
      if (!token) throw new Error("No token found. Please login again.");

      const res = await initiateCall(values, token);
      dispatch(createCallSuccess(res));

      localStorage.setItem("lastCallId", res.call_id);
      localStorage.setItem("callerEmail", values.caller_email);
    } catch (err: unknown) {
      let message = "Failed to create call";
      if (err instanceof Error) {
        message = err.message;
      }
      dispatch(createCallFailure(message));
    }
  };

  const handlePoll = async (id: string, interval?: number) => {
    if (!token) return;
    try {
      const res = await checkCallStatus(id, token);

      // ✅ full response dispatch karo
      dispatch(setTranscript(res));

      // ✅ check status & stop polling
      if (
        res.status === "completed" ||
        res.status === "busy" ||
        res.status === "no-answer"
      ) {
        if (interval) clearInterval(interval); // 👈 stop API hits
        navigate("/dashboard"); // 👈 redirect to dashboard
      }
    } catch (err) {
      console.error("Polling failed", err);
    }
  };

  // ✅ Polling every 3s when popup is open
  useEffect(() => {
    let interval: number;
    if (openPopup && callId) {
      interval = setInterval(() => {
        handlePoll(callId, interval); // 👈 pass interval ref
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [openPopup, callId, token]);

  // ✅ Status check function
  //   const handlePoll = async (id: string) => {
  //     if (!token) return;
  //     try {
  //       const res = await checkCallStatus(id, token);

  //       dispatch(setTranscript(res));
  //     } catch (err) {
  //       console.error("Polling failed", err);
  //     }
  //   };

  //   useEffect(() => {
  //     let interval: NodeJS.Timeout;
  //     if (openPopup && callId) {
  //       interval = setInterval(() => {
  //         handlePoll(callId);
  //       }, 3000);
  //     }
  //     return () => {
  //       if (interval) clearInterval(interval);
  //     };
  //   }, [openPopup, callId, token]);

  //   const onSubmit = async (data: CallFormInputs) => {
  //     console.log(data, "FORM DATA");
  //     try {
  //       const response = await fetch(`${backendUrl}api/assistant-initiate-call`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       });

  //       if (!response.ok) throw new Error("Failed to initiate call");

  //       const res = await response.json();
  //       localStorage.setItem("lastCallId", res.call_id);
  //       localStorage.setItem("callerEmail", data.caller_email);

  //       navigate("/call-details");
  //     } catch (err) {
  //       console.error(err);
  //       alert("Failed to initiate call. Please try again.");
  //     }
  //   };

  return (
    <>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#391f52]">
          CINDY AI
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                {...register("caller_name", { required: "Name is required" })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400  ${
                  errors.caller_name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Your Name"
              />
              {errors.caller_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.caller_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                {...register("caller_email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Email is invalid",
                  },
                })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400  ${
                  errors.caller_email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="name@example.com"
              />
              {errors.caller_email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.caller_email.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Phone Number
              </label>
              <input
                type="tel"
                {...register("caller_number", {
                  required: "Caller number is required",
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: "Enter a valid phone number",
                  },
                })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400  ${
                  errors.caller_number ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="+1234567890"
              />
              {errors.caller_number && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.caller_number.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number to Call
              </label>
              <input
                type="tel"
                {...register("outbound_number", {
                  required: "Outbound number is required",
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: "Enter a valid phone number",
                  },
                })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400  ${
                  errors.outbound_number ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="+1234567890"
              />
              {errors.outbound_number && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.outbound_number.message}
                </p>
              )}
            </div>
          </div>

          {/* Agent Name (New Field) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent Name
            </label>
            <select
              {...register("voice", { required: "Agent name is required" })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400  ${
                errors.voice ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Agent</option>
              <option value="david">David - english (Male)</option>
              <option value="ravi">Ravi - english (Male)</option>
              <option value="emily-british">Emily - english (Female)</option>
              <option value="alice-british">Alice - english (Female)</option>
              <option value="julia-british">Julia - english (Female)</option>
              <option value="julio">Julio - spanish (Male)</option>
              <option value="donato">Donato - spanish (Male)</option>
              <option value="helena-spanish">Helena - spanish (Female)</option>
              <option value="rosa">Rosa - spanish (Female)</option>
              <option value="mariam">Mariam - spanish (Female)</option>
            </select>
            {errors.voice && (
              <p className="text-red-500 text-xs mt-1">
                {errors.voice.message}
              </p>
            )}
          </div>

          {/* Objective */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Call Objective
            </label>
            <input
              type="text"
              {...register("objective", { required: "Objective is required" })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400  ${
                errors.objective ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Schedule a meeting"
            />
            {errors.objective && (
              <p className="text-red-500 text-xs mt-1">
                {errors.objective.message}
              </p>
            )}
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Call Context
            </label>
            <textarea
              {...register("context", { required: "Context is required" })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400  ${
                errors.context ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Provide any additional context for the call..."
            ></textarea>
            {errors.context && (
              <p className="text-red-500 text-xs mt-1">
                {errors.context.message}
              </p>
            )}
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              {...register("language")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 "
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#391f52] cursor-pointer text-white rounded-md hover:bg-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-400  focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Initiating Call..." : "Initiate Call"}
            </button>
          </div>
        </form>
      </div>
      {/* ==== Popup ==== */}
      {openPopup && (
        <div
          className="fixed inset-0  flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => dispatch(togglePopup(false))}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-[50%] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 p-6">Call Initiated</h2>
            <div className="flex flex-wrap items-center mb-4 px-6">
              <span className="font-medium">Call ID:</span>
              <span className="md:px-3 md:mx-5 py-1 bg-gray-100 rounded">
                {callId}
              </span>
            </div>
            {/* Transcript Box */}
            <div className="flex justify-between border border-purple-200 bg-purple-50 px-6 p-2">
              <p className="text-base font-semibold text-[#391f52] text-start mb-1 ">
                Call Transcript
              </p>
              <p className="text-base">
                <span className="font-bold">Status:</span>{" "}
                {status ?? "Pending..."}
              </p>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="text-gray-700 leading-relaxed">
                {Array.isArray(transcript) && transcript.length > 0 ? (
                  <ul className="space-y-2">
                    {/* {transcript.map((line, idx) => (
                      <li key={idx} className="text-sm">
                        {typeof line === "object" ? (
                          <>
                            <span className="font-semibold text-[#391f52]">
                              {line.role}:
                            </span>{" "}
                            {line.text}
                          </>
                        ) : (
                          <span>{line}</span>
                        )}
                      </li>
                    ))} */}
                    {Array.isArray(transcript) && transcript.length > 0 ? (
                      <div className="space-y-1">
                        {transcript.map((line, idx) => (
                          <p key={idx} className="text-sm">
                            <span className="font-semibold text-[#391f52]">
                              {line.role}:
                            </span>{" "}
                            {line.text}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No transcript yet...
                      </p>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No transcript yet...</p>
                )}
              </div>
            </div>

            {/* <div className="flex-1 overflow-y-auto border rounded-md p-3 mb-4 bg-gray-50 text-left">
              {transcript.length === 0 ? (
                <p className="text-gray-500 text-sm">No transcript yet...</p>
              ) : (
                transcript.map((line, idx) => (
                  <p key={idx} className="text-sm mb-1">
                    {line}
                  </p>
                ))
              )}
            </div> */}
            <div className="p-6 border-t border-purple-200 bg-purple-50 flex justify-center">
              <button
                onClick={() => callId && handlePoll(callId)}
                className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-[#391f52] text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg"
              >
                Check Status Now
              </button>
              <button
                onClick={() => dispatch(togglePopup(false))}
                className="ml-4 px-6 py-2 bg-gray-300 text-black rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CallForm;
