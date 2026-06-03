export interface Evaluation {
  id: string;
  studentId: string;
  courseId: string;
  type: 'exam' | 'assignment' | 'project';
  score: number;
  maxScore: number;
  date: Date;
  description: string;
}