export interface Student {
  id: string;
  name: string;
  email: string;
  career: string;
  semester: number;
  photoUrl?: string;
  createdAt: Date;
}