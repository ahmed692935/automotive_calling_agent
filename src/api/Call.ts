// import axios from "axios";
import type { CallFormInputs } from "../interfaces/callForm";
import axiosInstance from "./axiosInterceptor";
const API_URL = import.meta.env.VITE_API_URL as string;


export const initiateCall = async (data: CallFormInputs, token: string) => {
  const response = await axiosInstance.post(
    `${API_URL}/assistant-initiate-call`,
    data,
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

export const checkCallStatus = async (callId: string, token: string) => {
  const response = await axiosInstance.get(
    `${API_URL}/call-status/${callId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return response.data;
};
