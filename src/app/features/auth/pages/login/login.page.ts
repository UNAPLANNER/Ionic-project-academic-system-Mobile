import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule, RouterModule]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  /**
   * Inicializar formulario con validaciones
   */
  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Acceso conveniente a los campos del formulario
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Enviar formulario de login
   */
  async onSubmit() {
    this.submitted = true;

    // Validar que el formulario sea válido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      const { email, password } = this.loginForm.value;
      const user = await this.authService.login(email, password);

      this.presentToast(`¡Bienvenido ${user.name}!`, 'success');

      const destination = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      this.router.navigateByUrl(destination);
    } catch (error: any) {
      this.presentAlert('Error de Autenticación', error.message || 'No se pudo iniciar sesión');
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
