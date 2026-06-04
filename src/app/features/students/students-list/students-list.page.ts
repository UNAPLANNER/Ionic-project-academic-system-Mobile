import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { ApiService } from '../../../core/services/api.service';
import { Student } from '../../../core/models/student.model';
import { Course } from '../../../core/models/course.model';
import { AuthService } from '../../../core/services/auth.service';
import { ModalController } from '@ionic/angular';
import { EvaluationFormPage } from '../../evaluations/evaluation-form/evaluation-form.page';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.page.html',
  styleUrls: ['./students-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class StudentsListPage {
  students: Student[] = [];
  courses: Course[] = [];
  selectedCourseId: string | null = null;
  loading = false;
  loadingCourses = false;
  skeletonItems = [1, 2, 3, 4];

  constructor(
    private studentService: StudentService,
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  async ionViewWillEnter() {
    await this.loadCourses();
    await this.loadStudents();
  }

  async loadCourses() {
    this.loadingCourses = true;
    try {
      this.courses = await this.apiService.getCourses();
    } catch {
      this.courses = [];
    } finally {
      this.loadingCourses = false;
    }
  }

  async selectCourse(courseId: string | null) {
    if (this.selectedCourseId === courseId) return;
    this.selectedCourseId = courseId;
    await this.loadStudents();
  }

  async loadStudents() {
    this.loading = true;
    try {
      if (this.selectedCourseId) {
        this.students = await this.studentService.getByCourse(this.selectedCourseId);
      } else {
        this.students = await this.studentService.getAll();
      }
    } catch (err: any) {
      const msg = err?.error?.message ?? err?.message ?? 'No se pudo cargar la lista de estudiantes';
      const toast = await this.toastCtrl.create({ message: msg, duration: 3000, color: 'danger', position: 'bottom' });
      await toast.present();
      this.students = [];
    } finally {
      this.loading = false;
    }
  }

  goToCreate() {
    this.router.navigate(['/teacher/students/new']);
  }

  goToEdit(student: Student) {
    this.router.navigate(['/teacher/students/edit', student.id]);
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

  async openEvaluation(student: Student) {

  const modal = await this.modalCtrl.create({
    component: EvaluationFormPage,
    componentProps: {
      student
    }
  });

    await modal.present();
  }
}
