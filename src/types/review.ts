export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  meeting_title: string | null;
  user_name: string | null;
  user_avatar_url: string | null;
  created_at: string;
}
