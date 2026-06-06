import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ApiService, DashboardMetrics, CoursePerformance, TeacherSummary } from '../../../core/services/api.service';
import { User } from '../../../core/models/user.model';
import { Evaluation } from '../../../core/models/evaluation.model';
import { Course } from '../../../core/models/course.model';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DashboardPage implements OnInit {
  currentUser: User | null = null;
  isAdmin = false;
  isTeacher = false;
  loading = false;

  // Teacher data
  metrics: DashboardMetrics | null = null;
  performance: CoursePerformance[] = [];

  // Student data
  myEvaluations: Evaluation[] = [];
  myCourses: Course[] = [];
  students: Student[] = [];
  teachers: TeacherSummary[] = [];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(async user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'admin';
      this.isTeacher = user?.role === 'teacher';
      if (user) {
        await this.loadData(user);
      }
    });
  }

  async loadData(user: User) {
    this.loading = true;
    try {
      if (this.isAdmin) {
        const [students, teachers] = await Promise.all([
          this.apiService.getStudents(),
          this.apiService.getTeachers()
        ]);
        this.students = students;
        this.teachers = teachers;
      } else if (this.isTeacher) {
        const [metrics, performance] = await Promise.all([
          this.apiService.getDashboardMetrics(),
          this.apiService.getDashboardPerformance()
        ]);
        this.metrics = metrics;
        this.performance = performance;
      } else {
        const [courses, evaluationResponse] = await Promise.all([
          this.apiService.getCourses(),
          this.apiService.getStudentEvaluations(user.id)
        ]);
        this.myCourses = courses;
        this.myEvaluations = evaluationResponse.evaluations;
      }
    } catch {
      // API no disponible aún, se muestra datos vacíos
    } finally {
      this.loading = false;
    }
  }

  get averageGrade(): number {
    if (!this.myEvaluations.length) return 0;
    const total = this.myEvaluations.reduce((sum, e) => sum + (e.score / e.maxScore) * 100, 0);
    return Math.round(total / this.myEvaluations.length);
  }

  async refresh(event: any) {
    if (this.currentUser) await this.loadData(this.currentUser);
    event.target.complete();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/auth/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
