export interface AppointmentTotals {
  total: number;
  scheduled: number;
  cancelled: number;
  completed: number;
}

export interface Appointment {
  id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "cancelled" | "completed" | string;
  title: string;
  description: string | null;
  notes: string | null;
  created_at: string;
  caller_name: string;
  caller_email: string;
  caller_phone: string | null;
  call_id: string | null;
}

export interface AppointmentsResponse {
  totals: AppointmentTotals;
  appointments: Appointment[];
}
