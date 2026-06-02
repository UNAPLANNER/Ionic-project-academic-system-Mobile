import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../core/models/student.model';

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
    private toastCtrl: ToastController
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
}
