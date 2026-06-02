import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class RegisterPage {

  registerForm: FormGroup;
  showPassword = false;

  roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'student', label: 'Student' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['student', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creating account...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const { name, email, password, role } = this.registerForm.value;
      await this.authService.register(email, password, name, role);
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Account created successfully!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (error: any) {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: error,
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    }
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  goToLogin() { this.router.navigateByUrl('/login'); }

  get nameControl() { return this.registerForm.get('name'); }
  get emailControl() { return this.registerForm.get('email'); }
  get passwordControl() { return this.registerForm.get('password'); }
  get confirmPasswordControl() { return this.registerForm.get('confirmPassword'); }
  get roleControl() { return this.registerForm.get('role'); }
}