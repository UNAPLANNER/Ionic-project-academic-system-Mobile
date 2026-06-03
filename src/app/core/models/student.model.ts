export interface Student {
  id: string;
  name: string;
  email: string;
  career: string | null;
  semester: number | null;
  createdAt: Date;
}