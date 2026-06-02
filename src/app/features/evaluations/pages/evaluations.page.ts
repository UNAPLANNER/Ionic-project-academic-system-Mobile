import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';
import { Evaluation } from '../../../core/models/evaluation.model';
import { Student } from '../../../core/models/student.model';
import { Course } from '../../../core/models/course.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.page.html',
  styleUrls: ['./evaluations.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class EvaluationsPage implements OnInit {
  evaluations: Evaluation[] = [];
  students: Student[] = [];
  courses: Course[] = [];
  loading = false;
  isTeacher = false;
  currentUser: User | null = null;

  evalForm!: FormGroup;
  editingId: string | null = null;
  showForm = false;

  readonly evalTypes: Array<'exam' | 'assignment' | 'project'> = ['exam', 'assignment', 'project'];
  readonly typeLabels: Record<string, string> = { exam: 'Examen', assignment: 'Tarea', project: 'Proyecto' };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isTeacher = this.currentUser?.role === 'teacher';
    this.buildForm();
    this.loadData();
  }

  private buildForm(e?: Evaluation) {
    this.evalForm = this.fb.group({
      studentId: [e?.studentId || '', Validators.required],
      courseId: [e?.courseId || '', Validators.required],
      type: [e?.type || 'exam', Validators.required],
      score: [e?.score ?? 0, [Validators.required, Validators.min(0)]],
      maxScore: [e?.maxScore ?? 100, [Validators.required, Validators.min(1)]],
      description: [e?.description || '', Validators.required],
      date: [e?.date ? new Date(e.date).toISOString() : new Date().toISOString(), Validators.required]
    });
  }

  async loadData() {
    this.loading = true;
    try {
      if (this.isTeacher) {
        const [evaluations, students, courses] = await Promise.all([
          this.apiService.getEvaluations(),
          this.apiService.getStudents(),
          this.apiService.getCourses()
        ]);
        this.evaluations = evaluations;
        this.students = students;
        this.courses = courses;
      } else if (this.currentUser) {
        const [evaluations, courses] = await Promise.all([
          this.apiService.getStudentEvaluations(this.currentUser.id),
          this.apiService.getCourses()
        ]);
        this.evaluations = evaluations;
        this.courses = courses;
      }
    } catch {
      this.showToast('No se pudo cargar evaluaciones', 'danger');
    } finally {
      this.loading = false;
    }
  }

  getStudentName(id: string): string {
    return this.students.find(s => s.id === id)?.name ?? id;
  }

  getCourseName(id: string): string {
    return this.courses.find(c => c.id === id)?.name ?? id;
  }

  scorePercent(ev: Evaluation): number {
    return Math.round((ev.score / ev.maxScore) * 100);
  }

  openCreate() {
    this.editingId = null;
    this.buildForm();
    this.showForm = true;
  }

  openEdit(ev: Evaluation) {
    this.editingId = ev.id;
    this.buildForm(ev);
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
  }

  async saveEval() {
    if (this.evalForm.invalid) return;
    this.loading = true;
    try {
      const payload = { ...this.evalForm.value, date: new Date(this.evalForm.value.date) };
      if (this.editingId) {
        await this.apiService.updateEvaluation(this.editingId, payload);
        this.showToast('Evaluación actualizada', 'success');
      } else {
        await this.apiService.createEvaluation(payload);
        this.showToast('Evaluación registrada', 'success');
      }
      this.showForm = false;
      this.editingId = null;
      await this.loadData();
    } catch {
      this.showToast('Error al guardar evaluación', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async confirmDelete(ev: Evaluation) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar evaluación',
      message: `¿Eliminar "${ev.description}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.deleteEval(ev.id) }
      ]
    });
    await alert.present();
  }

  private async deleteEval(id: string) {
    try {
      await this.apiService.deleteEvaluation(id);
      this.showToast('Evaluación eliminada', 'success');
      await this.loadData();
    } catch {
      this.showToast('Error al eliminar', 'danger');
    }
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
    await toast.present();
  }
}
