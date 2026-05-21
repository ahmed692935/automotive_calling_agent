import axiosInstance from "./axiosInterceptor";
import type { VoicesResponse, UpdateVoicePayload, FlowEditorResponse, UpdatePromptPayload } from "../interfaces/voice";

export const getVoices = async (token: string): Promise<VoicesResponse> => {
  const response = await axiosInstance.get("retell/voices", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
};

export const updateVoice = async (token: string, payload: UpdateVoicePayload) => {
  const response = await axiosInstance.put("retell/agent/voice", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return response.data;
};

export const getFlowPrompt = async (token: string): Promise<FlowEditorResponse> => {
  const response = await axiosInstance.get("retell/flow/editor", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
};

export const updateFlowPrompt = async (token: string, payload: UpdatePromptPayload) => {
  const response = await axiosInstance.put("retell/flow/prompt-and-intro", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return response.data;
};
