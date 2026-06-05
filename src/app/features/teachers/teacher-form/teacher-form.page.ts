import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.page.html',
  styleUrls: ['./teacher-form.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class TeacherFormPage {
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    try {
      await this.apiService.createTeacher(this.form.value);
      await this.showToast('Profesor registrado correctamente', 'success');
      this.goBack();
    } catch (err: any) {
      const message = err?.error?.error ?? err?.message ?? 'No se pudo registrar el profesor';
      await this.showToast(message, 'danger');
    } finally {
      this.saving = false;
    }
  }

  goBack() {
    this.router.navigate(['/admin/teachers']);
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
