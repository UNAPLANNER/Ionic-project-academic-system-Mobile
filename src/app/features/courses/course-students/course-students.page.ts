import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { ApiService } from '../../../core/services/api.service';
import { Course } from '../../../core/models/course.model';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-course-students',
  templateUrl: './course-students.page.html',
  styleUrls: ['./course-students.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CourseStudentsPage implements OnInit {
  courseId = '';
  course: Course | null = null;
  students: Student[] = [];
  selectedIds = new Set<string>();
  loading = false;
  saving = false;

  get enrolledStudents(): Student[] {
    return this.students.filter(student => this.selectedIds.has(student.id));
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id') ?? '';
    this.course = history.state?.course ?? null;
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      const [students, courses] = await Promise.all([
        this.apiService.getStudents(),
        this.apiService.getCourses()
      ]);

      this.students = students;
      this.course = this.course ?? courses.find(course => course.id === this.courseId) ?? null;
      this.selectedIds = new Set(this.course?.students ?? []);
    } catch (err: any) {
      this.showToast(err?.error?.error ?? 'No se pudieron cargar estudiantes', 'danger');
    } finally {
      this.loading = false;
    }
  }

  toggleStudent(studentId: string, checked: boolean) {
    if (checked) {
      this.selectedIds.add(studentId);
      return;
    }

    this.selectedIds.delete(studentId);
  }

  removeStudent(studentId: string) {
    this.selectedIds.delete(studentId);
  }

  isSelected(studentId: string): boolean {
    return this.selectedIds.has(studentId);
  }

  async saveStudents() {
    this.saving = true;
    try {
      const updated = await this.apiService.updateCourseStudents(this.courseId, Array.from(this.selectedIds));
      this.course = updated;
      this.selectedIds = new Set(updated.students ?? []);
      this.showToast('Estudiantes asignados correctamente', 'success');
    } catch (err: any) {
      this.showToast(err?.error?.error ?? 'Error al asignar estudiantes', 'danger');
    } finally {
      this.saving = false;
    }
  }

  goBack() {
    this.router.navigate(['/teacher/courses']);
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2500, color, position: 'bottom' });
    await toast.present();
  }
}
