export interface User {
  id: string;
  email: string;
  role: 'teacher' | 'student';
  name: string;
}