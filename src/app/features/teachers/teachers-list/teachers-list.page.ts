import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService, TeacherSummary } from '../../../core/services/api.service';

@Component({
  selector: 'app-teachers-list',
  templateUrl: './teachers-list.page.html',
  styleUrls: ['./teachers-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class TeachersListPage {
  teachers: TeacherSummary[] = [];
  loading = false;

  constructor(
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async ionViewWillEnter() {
    await this.loadTeachers();
  }

  async loadTeachers() {
    this.loading = true;
    try {
      this.teachers = await this.apiService.getTeachers();
    } catch (err: any) {
      const message = err?.error?.error ?? 'No se pudo cargar profesores';
      const toast = await this.toastCtrl.create({ message, duration: 2500, color: 'danger', position: 'bottom' });
      await toast.present();
      this.teachers = [];
    } finally {
      this.loading = false;
    }
  }

  goToCreate() {
    this.router.navigate(['/admin/teachers/new']);
  }
}
