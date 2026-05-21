export interface Voice {
  voice_id: string;
  voice_name: string;
  provider: string;
  gender: string;
  age: string;
  accent: string;
  language: string | null;
  preview_audio_url: string;
}

export interface VoicesResponse {
  current_voice_id: string;
  voices: Voice[];
}

export interface UpdateVoicePayload {
  voice_id: string;
}

export interface FlowEditorResponse {
  conversation_flow_id: string;
  version: number;
  global_prompt: string;
  intro_node_id: string;
  intro_text: string;
}

export interface UpdatePromptPayload {
  global_prompt: string;
  intro_node_id: string;
  intro_text: string;
}
