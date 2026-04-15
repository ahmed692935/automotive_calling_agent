import axiosInstance from "./axiosInterceptor";

const API_URL = import.meta.env.VITE_API_URL as string;

// get all appointments
export const getAppointments = async (
  token: string,
  page: number = 1,
  pageSize: number = 10,
  allTime: boolean = false
) => {
  const response = await axiosInstance.get(
    `${API_URL}/dashboard/appointments`,
    {
      params: {
        page,
        page_size: pageSize,
        all_time: allTime,
      },
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

// Appointments detail
export const userDetailAppointment = async (token: string) => {
  const response = await axiosInstance.get(
    `${API_URL}/dashboard/appointments`,
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