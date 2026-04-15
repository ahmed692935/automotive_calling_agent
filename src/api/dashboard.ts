import axiosInstance from "./axiosInterceptor";
import type {
  DashboardCallDetailsResponse,
  DashboardReportsResponse,
} from "../interfaces/dashboard";

const API_URL = import.meta.env.VITE_API_URL as string;

export const fetchCallHistory = async (
  token: string,
  page = 1,
  pageSize = 10
) => {
  const response = await axiosInstance.get(
    `${API_URL}/call-history?page=${page}&page_size=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return response.data;
};

export const fetchCallTranscript = async (callId: string, token: string) => {
  const response = await axiosInstance.get(
    `${API_URL}/calls/${callId}/transcript`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  return response.data;
};

export const fetchDashboardReports = async (
  token: string,
  periodDays = 7
): Promise<DashboardReportsResponse> => {
  const response = await axiosInstance.get(
    `${API_URL}/dashboard/reports?period_days=${periodDays}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return response.data;
};

export const fetchDashboardCallById = async (
  callId: string,
  token: string
): Promise<DashboardCallDetailsResponse> => {
  const response = await axiosInstance.get(`${API_URL}/dashboard/calls/${callId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return response.data;
};
