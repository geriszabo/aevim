export interface Exercise {
  id: string;
  name: string;
  category?: string | null;
  created_at: string;
  user_id: string;
}
