import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  constructor(private api: ApiService) {}

  getAll(): Promise<Student[]> {
    return this.api.getStudents();
  }

  getById(id: string): Promise<Student> {
    return this.api.getStudent(id);
  }

  getByCourse(courseId: string): Promise<Student[]> {
    return this.api.getStudentsByCourse(courseId);
  }

  create(data: Partial<Student>): Promise<Student> {
    return this.api.createStudent(data);
  }

  update(id: string, data: Partial<Student>): Promise<Student> {
    return this.api.updateStudent(id, data);
  }
}
