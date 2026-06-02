import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Student } from '../models/student.model';
import { Course } from '../models/course.model';
import { Evaluation } from '../models/evaluation.model';
import { AuthService } from './auth.service';

export interface DashboardMetrics {
  totalStudents: number;
  totalCourses: number;
  totalEvaluations: number;
  averageScore: number;
}

export interface CoursePerformance {
  courseId: string;
  courseName: string;
  averageScore: number;
  totalStudents: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private async headers(): Promise<{ headers: HttpHeaders }> {
    const token = await this.authService.getIdToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token ?? ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ── Students ────────────────────────────────────────────────────
  async getStudents(): Promise<Student[]> {
    return firstValueFrom(this.http.get<Student[]>(`${this.api}/students`, await this.headers()));
  }

  async getStudent(id: string): Promise<Student> {
    return firstValueFrom(this.http.get<Student>(`${this.api}/students/${id}`, await this.headers()));
  }

  async createStudent(data: Partial<Student>): Promise<Student> {
    return firstValueFrom(this.http.post<Student>(`${this.api}/students`, data, await this.headers()));
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    return firstValueFrom(this.http.put<Student>(`${this.api}/students/${id}`, data, await this.headers()));
  }

  async deleteStudent(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.api}/students/${id}`, await this.headers()));
  }

  // ── Courses ─────────────────────────────────────────────────────
  async getCourses(): Promise<Course[]> {
    return firstValueFrom(this.http.get<Course[]>(`${this.api}/courses`, await this.headers()));
  }

  async getCourse(id: string): Promise<Course> {
    return firstValueFrom(this.http.get<Course>(`${this.api}/courses/${id}`, await this.headers()));
  }

  async createCourse(data: Partial<Course>): Promise<Course> {
    return firstValueFrom(this.http.post<Course>(`${this.api}/courses`, data, await this.headers()));
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    return firstValueFrom(this.http.put<Course>(`${this.api}/courses/${id}`, data, await this.headers()));
  }

  async deleteCourse(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.api}/courses/${id}`, await this.headers()));
  }

  // ── Evaluations ─────────────────────────────────────────────────
  async getEvaluations(): Promise<Evaluation[]> {
    return firstValueFrom(this.http.get<Evaluation[]>(`${this.api}/evaluations`, await this.headers()));
  }

  async getStudentEvaluations(studentId: string): Promise<Evaluation[]> {
    return firstValueFrom(this.http.get<Evaluation[]>(`${this.api}/evaluations/student/${studentId}`, await this.headers()));
  }

  async createEvaluation(data: Partial<Evaluation>): Promise<Evaluation> {
    return firstValueFrom(this.http.post<Evaluation>(`${this.api}/evaluations`, data, await this.headers()));
  }

  async updateEvaluation(id: string, data: Partial<Evaluation>): Promise<Evaluation> {
    return firstValueFrom(this.http.put<Evaluation>(`${this.api}/evaluations/${id}`, data, await this.headers()));
  }

  async deleteEvaluation(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.api}/evaluations/${id}`, await this.headers()));
  }

  // ── Dashboard ────────────────────────────────────────────────────
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return firstValueFrom(this.http.get<DashboardMetrics>(`${this.api}/dashboard/metrics`, await this.headers()));
  }

  async getDashboardPerformance(): Promise<CoursePerformance[]> {
    return firstValueFrom(this.http.get<CoursePerformance[]>(`${this.api}/dashboard/performance`, await this.headers()));
  }
}
