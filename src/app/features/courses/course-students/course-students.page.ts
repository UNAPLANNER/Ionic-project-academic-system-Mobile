import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CourseStudentsPage implements OnInit {
  courseId = '';
  course: Course | null = null;
  students: Student[] = [];
  searchTerm = '';
  selectedIds = new Set<string>();
  loading = false;
  saving = false;

  get enrolledStudents(): Student[] {
    return this.students.filter(student => this.selectedIds.has(student.id));
  }

  get filteredStudents(): Student[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.students;

    return this.students.filter(student =>
      [
        student.name,
        student.email,
        student.career ?? '',
        student.semester?.toString() ?? ''
      ].some(value => value.toLowerCase().includes(term))
    );
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
      this.course = courses.find(course => course.id === this.courseId) ?? this.course ?? null;
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
      await this.loadData();
      await this.showToast('Estudiantes asignados correctamente', 'success');
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
