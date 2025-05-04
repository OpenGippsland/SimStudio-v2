export interface User {
  id: number;
  email: string;
  simulator_hours: number;
}

export interface CoachProfile {
  id: number;
  user_id: number;
  hourly_rate: number;
  description: string;
  created_at: string;
  updated_at: string;
  users?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface BookingFormProps {
  onSuccess?: () => void;
  selectedUserId?: string;
}

export interface Session {
  startTime: string;
  endTime: string;
  formattedTime: string;
  isAvailable: boolean;
  unavailableReason?: string; // Optional reason why the slot is unavailable
}

export interface SessionsByDate {
  [date: string]: Session[];
}

export interface FormData {
  userId: string;
  hours: number;
  wantsCoach: boolean;
  coach: string;
  coachHours: number;
  date: string;
  sessionTime: string;
  coachingFee?: number;
  paidCoachingFee?: boolean;
  paymentRef?: string;
}

export interface SessionDetails {
  date: string;
  time: string;
  hours: number;
  coach: string;
  coachHours: number;
}

export interface Coach {
  id: string;
  name: string;
  hourly_rate?: number;
  description?: string;
}
