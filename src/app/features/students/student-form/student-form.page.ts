import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.page.html',
  styleUrls: ['./student-form.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class StudentFormPage implements OnInit {
  form!: FormGroup;
  studentId: string | null = null;
  saving = false;
  loadingStudent = false;

  get isEdit(): boolean {
    return !!this.studentId;
  }

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.buildForm();

    if (this.isEdit) {
      await this.loadStudent();
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      name:     ['', [Validators.required, Validators.minLength(3)]],
      email:    ['', [Validators.required, Validators.email]],
      career:   ['', Validators.required],
      semester: [1,  [Validators.required, Validators.min(1), Validators.max(12)]]
    });
  }

  private async loadStudent() {
    this.loadingStudent = true;
    try {
      const student = await this.studentService.getById(this.studentId!);
      this.form.patchValue({
        name:     student.name,
        email:    student.email,
        career:   student.career ?? '',
        semester: student.semester ?? 1
      });
    } catch {
      await this.showToast('No se pudo cargar los datos del estudiante', 'danger');
      this.goBack();
    } finally {
      this.loadingStudent = false;
    }
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    try {
      if (this.isEdit) {
        await this.studentService.update(this.studentId!, this.form.value);
        await this.showToast('Estudiante actualizado correctamente', 'success');
      } else {
        await this.studentService.create(this.form.value);
        await this.showToast('Estudiante creado correctamente', 'success');
      }
      this.goBack();
    } catch (err: any) {
      const msg = err?.error?.message ?? err?.message ?? 'Error al guardar el estudiante';
      await this.showToast(msg, 'danger');
    } finally {
      this.saving = false;
    }
  }

  cancel() {
    this.goBack();
  }

  private goBack() {
    const role = this.authService.getUserRole();
    this.router.navigate([role === 'admin' ? '/admin/students' : '/teacher/students']);
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.hasError(error) && ctrl.touched);
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2500, color, position: 'bottom' });
    await toast.present();
  }
}
