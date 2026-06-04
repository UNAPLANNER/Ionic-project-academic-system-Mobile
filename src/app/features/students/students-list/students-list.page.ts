import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../core/models/student.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.page.html',
  styleUrls: ['./students-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class StudentsListPage {
  students: Student[] = [];
  loading = false;
  skeletonItems = [1, 2, 3, 4];

  constructor(
    private studentService: StudentService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.loadStudents();
  }

  async loadStudents() {
    this.loading = true;
    try {
      this.students = await this.studentService.getAll();
    } catch (err: any) {
      const msg = err?.error?.message ?? err?.message ?? 'No se pudo cargar la lista de estudiantes';
      const toast = await this.toastCtrl.create({ message: msg, duration: 3000, color: 'danger', position: 'bottom' });
      await toast.present();
      this.students = [];
    } finally {
      this.loading = false;
    }
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
}
