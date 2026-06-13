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
  overallAverage: number;
  atRiskCount: number;
  performanceByCourse: CoursePerformance[];
}

export interface CoursePerformance {
  courseId: string;
  courseName: string;
  averageScore: number;
  totalStudents: number;
}

export interface TeacherSummary {
  id: string;
  name: string;
  email: string;
  role: 'teacher';
}

export interface CreateTeacherPayload {
  name: string;
  email: string;
  password: string;
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
    const res = await firstValueFrom(
      this.http.get<{ students: Student[] } | Student[]>(`${this.api}/students`, await this.headers())
    );
    return Array.isArray(res) ? res : res.students ?? [];
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

  async getTeachers(): Promise<TeacherSummary[]> {
    const res = await firstValueFrom(
      this.http.get<{ teachers: TeacherSummary[] } | TeacherSummary[]>(`${this.api}/users/teachers`, await this.headers())
    );
    return Array.isArray(res) ? res : res.teachers ?? [];
  }

  async createTeacher(data: CreateTeacherPayload): Promise<TeacherSummary> {
    const res = await firstValueFrom(
      this.http.post<{ teacher: TeacherSummary } | TeacherSummary>(`${this.api}/users/teachers`, data, await this.headers())
    );
    return 'teacher' in res ? res.teacher : res;
  }

  // ── Courses ─────────────────────────────────────────────────────
  async getCourses(): Promise<Course[]> {
    const res = await firstValueFrom(
      this.http.get<{ courses: Course[] } | Course[]>(`${this.api}/courses`, await this.headers())
    );
    return Array.isArray(res) ? res : res.courses ?? [];
  }

  async getStudentsByCourse(courseId: string): Promise<Student[]> {
    const res = await firstValueFrom(
      this.http.get<{ students: Student[] } | Student[]>(
        `${this.api}/courses/${courseId}/students`, await this.headers()
      )
    );
    return Array.isArray(res) ? res : res.students ?? [];
  }

  async getCourse(id: string): Promise<Course> {
    return firstValueFrom(this.http.get<Course>(`${this.api}/courses/${id}`, await this.headers()));
  }

  async createCourse(data: Partial<Course>): Promise<Course> {
    const res = await firstValueFrom(
      this.http.post<{ course: Course } | Course>(`${this.api}/courses`, data, await this.headers())
    );
    return 'course' in res ? res.course : res;
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    const res = await firstValueFrom(
      this.http.put<{ course: Course } | Course>(`${this.api}/courses/${id}`, data, await this.headers())
    );
    return 'course' in res ? res.course : res;
  }

  async updateCourseStudents(id: string, students: string[]): Promise<Course> {
    const res = await firstValueFrom(
      this.http.put<{ course: Course } | Course>(
        `${this.api}/courses/${id}/students`,
        { students },
        await this.headers()
      )
    );
    return 'course' in res ? res.course : res;
  }

  async updateCourseTeacher(id: string, teacherId: string): Promise<Course> {
    const res = await firstValueFrom(
      this.http.put<{ course: Course } | Course>(
        `${this.api}/courses/${id}/teacher`,
        { teacherId },
        await this.headers()
      )
    );
    return 'course' in res ? res.course : res;
  }

  async deleteCourse(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.api}/courses/${id}`, await this.headers()));
  }

  // ── Evaluations ─────────────────────────────────────────────────
  async getEvaluations(): Promise<Evaluation[]> {
    return firstValueFrom(this.http.get<Evaluation[]>(`${this.api}/evaluations`, await this.headers()));
  }

  /*async getStudentEvaluations(studentId: string): Promise<Evaluation[]> {
    return firstValueFrom(this.http.get<Evaluation[]>(`${this.api}/evaluations/student/${studentId}`, await this.headers()));
  }*/
  async getStudentEvaluations(studentId: string): Promise<{
    evaluations: Evaluation[];
    average: number;
  }> {
    return firstValueFrom(
      this.http.get<{
        evaluations: Evaluation[];
        average: number;
      }>(
        `${this.api}/evaluations/student/${studentId}`,
        await this.headers()
      )
    );
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
