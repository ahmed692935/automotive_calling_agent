// export interface RowData {
//   id: number;
//   name: string;
//   agent: string;
//   date: string;
//   transcription: string;
//   summary: string;
//   col1: string;
//   col2: string;
//   col3: string;
//   col4: string;
//   col5: string;
//   col6: string;
//   col7: string;
// }

// export interface Call {
//   id: number;
//   call_id: string;
//   status: string | null;
//   duration: number | null;
//   transcript: string | null;
//   summary: string | null;
//   recording_url: string | null;
//   created_at: string;
//   started_at: string | null;
//   ended_at: string | null;
//   voice_id: string;
//   voice_name: string;
//   from_number: string | null;
//   to_number: string | null;
//   user_id: number;
//   username: string;
//   email: string;
// }

// export interface CallHistoryResponse {
//   user_id: number;
//   calls: Call[];
// }

// export interface CallHistoryState {
//   loading: boolean;
//   error: string | null;
//   calls: Call[];
// }

// One transcript line in the call
// export interface TranscriptLine {
//   role: string;
//   text: string;
// }

// // Single Call record
// export interface Call {
//   id: number;
//   call_id: string;
//   status:
//     | "completed"
//     | "no-answer"
//     | "queued"
//     | "busy"
//     | "not_attended"
//     | "connected"
//     | null;
//   duration: number | null;
//   // transcript: TranscriptLine[] | null;
//   transcript: TranscriptLine[] | null;
//   summary: string | null;
//   recording_url: string | null;
//   created_at: string;
//   started_at: string | null;
//   ended_at: string | null;
//   voice_id: string;
//   voice_name: string;
//   from_number: string | null;
//   to_number: string | null;
//   user_id: number;
//   username: string;
//   email: string;
// }

// // Pagination info
// export interface Pagination {
//   page: number;
//   perPage: number;
//   total: number;
//   completed_calls: number;
//   not_completed_calls: number;
// }

// // API response for call history
// export interface CallHistoryResponse {
//   user_id: number;
//   calls: Call[];
//   pagination: Pagination;
// }

// // Local state shape (Redux / React state)
// export interface CallHistoryState {
//   loading: boolean;
//   error: string | null;
//   calls: Call[];
//   pagination: Pagination | null;
// }

// // ✅ Type for table rows (you can use Call directly too)
// export type RowData = Call;

export interface TranscriptItem {
  role: string;
  content: string[] | string;
}

export interface Transcript {
  items: TranscriptItem[];
  note: string;
}

// Single Call record
export interface Call {
  transcript: any;
  call_id: string;
  status:
    | "completed"
    | "unanswered"
    | "no-answer"
    | "queued"
    | "busy"
    | "not_attended"
    | "connected"
    | null;
  duration: number | null;
  transcript_text: string | null;
  summary: string | null;
  recording_url: string | null;
  started_at: string | null;
  ended_at: string | null;
  agent_phone: string | null;
  caller_phone: string | null;
}

// Pagination info
export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  completed_calls: number;
  not_completed_calls: number;
}

// API response for call history
export interface CallHistoryResponse {
  user_id: number;
  calls: Call[];
  pagination: Pagination;
}

// Local state shape
export interface CallHistoryState {
  loading: boolean;
  error: string | null;
  calls: Call[];
  pagination: Pagination | null;
}

export type RowData = Call;

export interface AppointmentStatusDistribution {
  [status: string]: number;
}

export interface ReportSummary {
  total_calls: number;
  total_appointments: number;
  total_minutes: number;
  successful_calls: number;
  unanswered_calls: number;
  repeat_callers: number;
  new_callers: number;
  appointment_status_distribution: AppointmentStatusDistribution;
}

export interface TrendPoint {
  date: string;
  count: number;
}

export interface RepeatCaller {
  phone: string;
  name: string;
  call_count: number;
}

export interface SentimentBreakdown {
  positive?: number;
  neutral?: number;
  negative?: number;
  [key: string]: number | undefined;
}

export interface DashboardReportsResponse {
  period_days: number;
  summary: ReportSummary;
  calls_over_time: TrendPoint[];
  appointments_over_time: TrendPoint[];
  top_repeat_callers: RepeatCaller[];
  sentiment_breakdown: SentimentBreakdown;
}

export interface DashboardCallDetailsResponse {
  call_id: string;
  status: Call["status"];
  caller_phone: string | null;
  agent_phone: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration: number | null;
  recording_url: string | null;
  transcript: Transcript | string | null;
  summary: string | null;
  sentiment: string | null;
  booking_done: boolean;
}
