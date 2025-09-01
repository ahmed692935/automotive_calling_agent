export interface CallFormInputs {
  caller_name: string;
  caller_email: string;
  caller_number: string;
  outbound_number: string;
  objective: string;
  context: string;
  language: "english" | "spanish";
  voice: string;
}

export interface TranscriptLine {
  role: string;
  text: string;
}

export interface TranscriptPayload {
  status?: string | null;
  transcript?: TranscriptLine[] | string;
}
