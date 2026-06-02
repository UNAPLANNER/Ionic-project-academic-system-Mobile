import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule]
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  selectedRole: 'student' | 'teacher' = 'student';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  /**
   * Inicializar formulario con validaciones
   */
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['student', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Validador personalizado: verificar que las contraseñas coincidan
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Acceso conveniente a los campos del formulario
   */
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Enviar formulario de registro
   */
  async onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      const { name, email, password, role } = this.registerForm.value;

      const user = await this.authService.register(
        email,
        password,
        name,
        role as 'student' | 'teacher'
      );

      this.presentToast(`¡Bienvenido ${user.name}! Cuenta creada exitosamente`, 'success');

      // Redirigir al dashboard
      this.router.navigateByUrl('/dashboard');
    } catch (error: any) {
      this.presentAlert('Error de Registro', error.message || 'No se pudo crear la cuenta');
    } finally {
      this.loading = false;
    }
  }

  /**
   * Toast notification
   */
  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  /**
   * Alert dialog
   */
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
