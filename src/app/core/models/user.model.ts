export interface User {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  name: string;
}
