export interface ApiResponse {
  id: number;
  user_id: number;
  title: string;
  due_on: Date;
  status: 'completed' | 'pending';
}
