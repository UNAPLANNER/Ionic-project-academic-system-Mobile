export interface Course {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  credits: number;
  schedule: string;
  students: string[];
}