import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from '../../../core/services/api.service';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class StudentsPage implements OnInit {
  students: Student[] = [];
  filtered: Student[] = [];
  loading = false;
  searchTerm = '';

  studentForm!: FormGroup;
  editingId: string | null = null;
  showForm = false;

  constructor(
    private apiService: ApiService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
    this.loadStudents();
  }

  private buildForm(s?: Student) {
    this.studentForm = this.fb.group({
      name: [s?.name || '', [Validators.required, Validators.minLength(3)]],
      email: [s?.email || '', [Validators.required, Validators.email]],
      career: [s?.career || '', Validators.required],
      semester: [s?.semester || 1, [Validators.required, Validators.min(1), Validators.max(12)]]
    });
  }

  async loadStudents() {
    this.loading = true;
    try {
      this.students = await this.apiService.getStudents();
      this.applyFilter();
    } catch {
      this.showToast('No se pudo cargar estudiantes', 'danger');
    } finally {
      this.loading = false;
    }
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filtered = this.students.filter(s =>
      s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term)
    );
  }

  openCreate() {
    this.editingId = null;
    this.buildForm();
    this.showForm = true;
  }

  openEdit(student: Student) {
    this.editingId = student.id;
    this.buildForm(student);
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
  }

  async saveStudent() {
    if (this.studentForm.invalid) return;
    this.loading = true;
    try {
      if (this.editingId) {
        await this.apiService.updateStudent(this.editingId, this.studentForm.value);
        this.showToast('Estudiante actualizado', 'success');
      } else {
        await this.apiService.createStudent(this.studentForm.value);
        this.showToast('Estudiante creado', 'success');
      }
      this.showForm = false;
      this.editingId = null;
      await this.loadStudents();
    } catch {
      this.showToast('Error al guardar estudiante', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async confirmDelete(student: Student) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar estudiante',
      message: `¿Eliminar a ${student.name}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.deleteStudent(student.id)
        }
      ]
    });
    await alert.present();
  }

  private async deleteStudent(id: string) {
    try {
      await this.apiService.deleteStudent(id);
      this.showToast('Estudiante eliminado', 'success');
      await this.loadStudents();
    } catch {
      this.showToast('Error al eliminar', 'danger');
    }
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
    await toast.present();
  }
}
