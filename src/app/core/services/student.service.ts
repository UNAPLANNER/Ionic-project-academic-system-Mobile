import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  constructor(private api: ApiService) {}

  getAll(): Promise<Student[]> {
    return this.api.getStudents();
  }
}
