export interface Workout {
  id: string;
  name: string;
  notes?: string | null;
  date: string;
  created_at: string;
  user_id: string;
}
