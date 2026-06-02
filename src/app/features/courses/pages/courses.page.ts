import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class CoursesPage implements OnInit {
  courses: Course[] = [];
  loading = false;
  isTeacher = false;

  courseForm!: FormGroup;
  editingId: string | null = null;
  showForm = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.isTeacher = user?.role === 'teacher';
    this.buildForm();
    this.loadCourses();
  }

  private buildForm(c?: Course) {
    this.courseForm = this.fb.group({
      name: [c?.name || '', [Validators.required, Validators.minLength(3)]],
      code: [c?.code || '', Validators.required],
      credits: [c?.credits || 3, [Validators.required, Validators.min(1)]],
      schedule: [c?.schedule || '', Validators.required]
    });
  }

  async loadCourses() {
    this.loading = true;
    try {
      this.courses = await this.apiService.getCourses();
    } catch {
      this.showToast('No se pudo cargar cursos', 'danger');
    } finally {
      this.loading = false;
    }
  }

  openCreate() {
    this.editingId = null;
    this.buildForm();
    this.showForm = true;
  }

  openEdit(course: Course) {
    this.editingId = course.id;
    this.buildForm(course);
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
  }

  async saveCourse() {
    if (this.courseForm.invalid) return;
    this.loading = true;
    try {
      if (this.editingId) {
        await this.apiService.updateCourse(this.editingId, this.courseForm.value);
        this.showToast('Curso actualizado', 'success');
      } else {
        await this.apiService.createCourse(this.courseForm.value);
        this.showToast('Curso creado', 'success');
      }
      this.showForm = false;
      this.editingId = null;
      await this.loadCourses();
    } catch {
      this.showToast('Error al guardar curso', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async confirmDelete(course: Course) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar curso',
      message: `¿Eliminar "${course.name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.deleteCourse(course.id)
        }
      ]
    });
    await alert.present();
  }

  private async deleteCourse(id: string) {
    try {
      await this.apiService.deleteCourse(id);
      this.showToast('Curso eliminado', 'success');
      await this.loadCourses();
    } catch {
      this.showToast('Error al eliminar', 'danger');
    }
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
    await toast.present();
  }
}
