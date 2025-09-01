// import axios from "axios";
import axiosInstance from "./axiosInterceptor";

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
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return response.data;
};
