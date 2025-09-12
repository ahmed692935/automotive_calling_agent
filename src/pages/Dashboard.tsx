import { useEffect, useState } from "react";
import type { RowData } from "../interfaces/dashboard";
import { FiCheckCircle, FiPhone, FiXCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchCallHistory } from "../api/dashboard";
import {
  fetchCallsFailure,
  fetchCallsStart,
  fetchCallsSuccess,
} from "../store/slices/dashboardSlice";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [activeTab, setActiveTab] = useState<"transcription" | "summary">(
    "transcription"
  );

  const dispatch = useDispatch<AppDispatch>();
  const { calls, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  const [currentPage, setCurrentPage] = useState(1); // ✅ pagination state
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

  // const successfulCalls = calls.filter((c) => c.status === "completed").length;
  // const failedCalls = calls.filter(
  //   (c) => c.status === "failed" || c.status === "queued"
  // ).length;

  // const authState = useSelector((state: RootState) => state.auth);

  // console.log(authState, "DATA");

  useEffect(() => {
    const loadHistory = async () => {
      if (token) {
        try {
          dispatch(fetchCallsStart());
          // const data = await fetchCallHistory(token, 1, 10);
          const data = await fetchCallHistory(token, currentPage, pageSize);

          dispatch(
            fetchCallsSuccess({
              calls: data.calls,
              pagination: data.pagination,
              // status_counts: data.status_counts,
            })
          );
        } catch (err: unknown) {
          console.error("Failed to fetch call history:", err);
          let errorMessage = "Failed to fetch call history";

          if (err instanceof Error) {
            errorMessage = err.message;
          }

          dispatch(fetchCallsFailure(errorMessage));
        }
      }
    };

    loadHistory();
  }, [dispatch, token, currentPage]);

  // if (loading) return <p>Loading calls...</p>;
  // if (loading)
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen space-y-4">
  //       {/* Spinner */}
  //       <div className="w-12 h-12 border-4 border-purple-300 border-t-[#391f52] rounded-full animate-spin"></div>

  //       {/* Text */}
  //       <p className="text-lg font-semibold text-[#391f52]">
  //         Loading analytics...
  //       </p>
  //     </div>
  //   );

  if (error) return <p className="text-red-500">{error}</p>;

  const handleOpenModal = (row: RowData) => {
    setSelectedRow(row);
    setActiveTab("transcription");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  return (
    <div className="">
      <div className=" py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#391f52] mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-[#391f52]">
            Monitor and analyze agent interactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Calls */}
          <div className="bg-white rounded-xl shadow-lg border border-purple-200 p-6 flex items-center justify-between">
            {/* Text */}
            <div>
              <h3 className="text-lg font-semibold text-[#391f52]">
                Total Calls
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {totalCalls || 0}
              </p>
            </div>

            {/* Icon Box */}
            <div className="bg-[#391f52] text-white p-4 rounded-lg flex items-center justify-center">
              <FiPhone size={28} />
            </div>
          </div>

          {/* Successful Calls */}
          <div className="bg-white rounded-xl shadow-lg border border-green-200 p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-700">
                Successful Calls
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {successfulCalls}
              </p>
            </div>
            <div className="bg-green-600 text-white p-4 rounded-lg flex items-center justify-center mr-4">
              <FiCheckCircle size={24} />
            </div>
          </div>

          {/* Failed Calls */}
          <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-700">Others</h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {queuedCalls}
              </p>
            </div>
            <div className="bg-red-600 text-white p-4 rounded-lg flex items-center justify-center mr-4">
              <FiXCircle size={24} />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-purple-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#391f52] to-purple-700 border-b border-purple-500">
                  <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
                    User Info
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
                    Agent Name
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
                    Receiver Number
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
                    Call Status
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
                    Call Creation
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
                    Call Duration (mins)
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-white whitespace-nowrap">
                    Recording Url
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-white whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              {/* <tbody>
                {calls?.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-b border-purple-100 hover:bg-purple-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-purple-25" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-4 text-gray-800 whitespace-nowrap">
                      {row.username}
                      <p className="text-xs">{row.email}</p>
                      <p className="text-xs">{row.from_number || "N/A"}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
                      {row.voice_name}
                    </td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
                      {row.to_number}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full font-semibold
      ${row.status === "completed" ? "bg-green-100 text-green-800" : ""}
      ${row.status === "queued" ? "bg-gray-200 text-gray-800" : ""}
      ${row.status === "failed" ? "bg-red-100 text-red-800" : ""}
    `}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                      {row.started_at
                        ? new Date(row.started_at).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                      {row.duration || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                      {row.recording_url ? (
                        <a
                          href={row.recording_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 underline"
                        >
                          Listen
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleOpenModal(row)}
                        className="px-4 py-2 cursor-pointer text-sm font-medium bg-[#391f52] text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody> */}
              <tbody>
                {/* ✅ Table level loading state */}
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-10 text-[#391f52] font-medium"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-8 h-8 border-4 border-purple-300 border-t-[#391f52] rounded-full animate-spin"></div>
                        <p>Loading calls...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  calls?.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`border-b border-purple-100 hover:bg-purple-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-purple-25" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-4 text-gray-800 whitespace-nowrap">
                        {row.username}
                        <p className="text-xs">{row.email}</p>
                        <p className="text-xs">{row.from_number || "N/A"}</p>
                      </td>
                      <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
                        {row.voice_name}
                      </td>
                      <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
                        {row.to_number}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full font-semibold
                    ${
                      row.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                    ${
                      row.status === "queued" ? "bg-gray-200 text-gray-800" : ""
                    }
                    ${
                      row.status === "no-answer"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }
                    ${row.status === "busy" ? "bg-red-100 text-red-800" : ""}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        {row.started_at
                          ? new Date(row.started_at).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        {row.duration ? Number(row.duration).toFixed(2) : "N/A"}
                      </td>
                      <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                        {row.recording_url ? (
                          <a
                            href={row.recording_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 underline"
                          >
                            Listen
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleOpenModal(row)}
                          className="px-4 py-2 cursor-pointer text-sm font-medium bg-[#391f52] text-white rounded-lg hover:scale-105 transition"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer "
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {openModal && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl rounded-xl border border-purple-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-purple-200 bg-gradient-to-b from-[#6d0f78] to-[#0a0f2d]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Call Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 mt-3 gap-1 md:gap-30 text-sm">
                    {/* Left Column */}
                    <div className="space-y-1">
                      <p className="text-purple-100">
                        <span className="text-purple-200">User ID:</span>{" "}
                        {selectedRow.user_id || "N/A"}
                      </p>
                      <p className="text-purple-100">
                        <span className="text-purple-200">Agent ID:</span>{" "}
                        {selectedRow.voice_id || "N/A"}
                      </p>
                      <p className="text-purple-100">
                        <span className="text-purple-200">Call ID:</span>{" "}
                        {selectedRow.call_id || "N/A"}
                      </p>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-1">
                      <p className="text-purple-100">
                        <span className="text-purple-200">Call Started:</span>{" "}
                        {selectedRow.started_at
                          ? new Date(selectedRow.started_at).toLocaleString()
                          : "N/A"}
                      </p>
                      <p className="text-purple-100">
                        <span className="text-purple-200">Call Ended:</span>{" "}
                        {selectedRow.ended_at
                          ? new Date(selectedRow.ended_at).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="text-purple-200 hover:text-white transition-colors p-1 cursor-pointer"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-purple-200 bg-purple-50">
              <button
                className={`px-6 py-4 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === "transcription"
                    ? "text-[#391f52] bg-white"
                    : "text-purple-900 hover:text-purple-700 hover:bg-purple-100"
                }`}
                onClick={() => setActiveTab("transcription")}
              >
                Transcription
                {activeTab === "transcription" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#391f52]"></div>
                )}
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === "summary"
                    ? "text-[#391f52] bg-white"
                    : "text-purple-900 hover:text-purple-700 hover:bg-purple-100"
                }`}
                onClick={() => setActiveTab("summary")}
              >
                Summary
                {activeTab === "summary" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#391f52]"></div>
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="text-gray-700 leading-relaxed">
                {activeTab === "transcription" ? (
                  <div>
                    <h4 className="text-[#391f52] font-semibold mb-3">
                      Call Transcription
                    </h4>
                    {/* <p className="text-gray-600">{selectedRow.transcription}</p> */}
                    {selectedRow.transcript ? (
                      <ul className="space-y-2">
                        {selectedRow.transcript.map((line, idx) => (
                          <li key={idx} className="text-sm">
                            <span className="font-semibold text-[#391f52]">
                              {line.role}:
                            </span>{" "}
                            {line.text}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">
                        No transcription available
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <h4 className="text-[#391f52] font-semibold mb-3">
                      Call Summary
                    </h4>
                    <p className="text-gray-600">
                      {selectedRow.summary || "No summary available"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-purple-200 bg-purple-50 flex justify-center">
              <button
                onClick={handleCloseModal}
                className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-[#391f52] text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
