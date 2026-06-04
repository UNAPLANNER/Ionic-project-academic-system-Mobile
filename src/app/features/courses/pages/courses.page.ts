import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';
import { Course } from '../../../core/models/course.model';

interface ScheduleEntry {
  day: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class CoursesPage implements OnInit {
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  searchTerm = '';
  loading = false;
  saving = false;
  isTeacher = false;
  formMode: 'list' | 'create' | 'edit' = 'list';
  courseForm!: FormGroup;
  days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

  get isFormMode(): boolean {
    return this.formMode !== 'list';
  }

  get filteredCourses(): Course[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.courses;

    return this.courses.filter(course =>
      [course.name, course.code, course.schedule].some(value => value?.toLowerCase().includes(term))
    );
  }

  get scheduleEntries(): FormArray {
    return this.courseForm.get('scheduleEntries') as FormArray;
  }

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.isTeacher = user?.role === 'teacher';
    this.buildForm();
    this.loadCourses();
  }

  private buildForm(course?: Course) {
    const scheduleEntries: ScheduleEntry[] = this.parseSchedule(course?.schedule);

    this.courseForm = this.fb.group({
      name: [course?.name ?? '', [Validators.required, Validators.minLength(3)]],
      code: [course?.code ?? '', Validators.required],
      credits: [course?.credits ?? 3, [Validators.required, Validators.min(1)]],
      scheduleEntries: this.fb.array(scheduleEntries.map(entry => this.createScheduleEntry(entry)))
    });
  }

  private createScheduleEntry(entry: ScheduleEntry = { day: 'Lunes', startTime: '00:00', endTime: '00:00' }): FormGroup {
    return this.fb.group({
      day: [entry.day, Validators.required],
      startTime: [entry.startTime, Validators.required],
      endTime: [entry.endTime, Validators.required]
    });
  }

  private parseSchedule(schedule?: string): ScheduleEntry[] {
    if (!schedule) return [{ day: 'Lunes', startTime: '00:00', endTime: '00:00' }];

    const entries: ScheduleEntry[] = [];

    schedule.split(';').forEach((segment: string) => {
      const times = segment.match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);
      const selectedDays = this.days.filter(day => segment.toLowerCase().includes(day.toLowerCase()));

      selectedDays.forEach(day => {
        entries.push({
          day,
          startTime: times?.[1] ?? '00:00',
          endTime: times?.[2] ?? '00:00'
        });
      });
    });

    return entries.length ? entries : [{ day: 'Lunes', startTime: '00:00', endTime: '00:00' }];
  }

  async loadCourses() {
    this.loading = true;
    try {
      this.courses = await this.apiService.getCourses();
      this.selectedCourse = this.selectedCourse
        ? this.courses.find(course => course.id === this.selectedCourse?.id) ?? null
        : null;
    } catch {
      this.showToast('No se pudo cargar cursos', 'danger');
    } finally {
      this.loading = false;
    }
  }

  openCreate() {
    this.selectedCourse = null;
    this.formMode = 'create';
    this.buildForm();
  }

  openEdit(course?: Course, event?: Event) {
    event?.stopPropagation();
    if (course) this.selectedCourse = course;
    if (!this.selectedCourse) return;

    this.formMode = 'edit';
    this.buildForm(this.selectedCourse);
  }

  async confirmDelete(course: Course, event?: Event) {
    event?.stopPropagation();

    const alert = await this.alertCtrl.create({
      header: 'Eliminar curso',
      message: `Deseas eliminar "${course.name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.deleteCourse(course)
        }
      ]
    });

    await alert.present();
  }

  private async deleteCourse(course: Course) {
    this.loading = true;
    try {
      await this.apiService.deleteCourse(course.id);
      this.showToast('Curso eliminado correctamente', 'success');
      if (this.selectedCourse?.id === course.id) this.selectedCourse = null;
      await this.loadCourses();
    } catch (err: any) {
      const msg = err?.error?.error ?? err?.message ?? 'Error al eliminar curso';
      this.showToast(msg, 'danger');
    } finally {
      this.loading = false;
    }
  }

  cancelForm() {
    this.formMode = 'list';
    this.buildForm();
  }

  isDaySelected(day: string): boolean {
    return this.scheduleEntries.controls.some(control => control.get('day')?.value === day);
  }

  toggleDay(day: string) {
    const index = this.scheduleEntries.controls.findIndex(control => control.get('day')?.value === day);

    if (index >= 0) {
      this.scheduleEntries.removeAt(index);
      return;
    }

    this.scheduleEntries.push(this.createScheduleEntry({ day, startTime: '00:00', endTime: '00:00' }));
  }

  async saveCourse() {
    if (this.courseForm.invalid || this.scheduleEntries.length === 0) {
      this.courseForm.markAllAsTouched();
      if (this.scheduleEntries.length === 0) this.showToast('Selecciona al menos un dia', 'danger');
      return;
    }

    const raw = this.courseForm.value;
    const schedule = raw.scheduleEntries
      .map((entry: ScheduleEntry) => `${entry.day} ${entry.startTime}-${entry.endTime}`)
      .join('; ');

    const payload = {
      name: raw.name,
      code: raw.code,
      credits: Number(raw.credits),
      schedule
    };

    this.saving = true;
    try {
      if (this.formMode === 'edit' && this.selectedCourse) {
        const updated = await this.apiService.updateCourse(this.selectedCourse.id, payload);
        this.selectedCourse = updated;
        this.showToast('Curso actualizado correctamente', 'success');
      } else {
        await this.apiService.createCourse(payload);
        this.showToast('Curso creado correctamente', 'success');
      }

      this.formMode = 'list';
      await this.loadCourses();
    } catch (err: any) {
      const msg = err?.error?.error ?? err?.message ?? 'Error al guardar curso';
      this.showToast(msg, 'danger');
    } finally {
      this.saving = false;
    }
  }

  getCardClass(index: number): string {
    const classes = ['navy', 'blue', 'green', 'teal'];
    return classes[index % classes.length];
  }

  getCourseIcon(index: number): string {
    const icons = ['server-outline', 'git-network-outline', 'language-outline', 'calculator-outline'];
    return icons[index % icons.length];
  }

  getEnrolledCount(course: Course): number {
    return course.totalStudents ?? course.students?.length ?? 0;
  }

  hasError(field: string, error: string): boolean {
    const control = this.courseForm.get(field);
    return !!(control?.hasError(error) && control.touched);
  }

  hasScheduleError(index: number, field: string): boolean {
    const control = this.scheduleEntries.at(index).get(field);
    return !!(control?.hasError('required') && control.touched);
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, duration: 2500, color, position: 'bottom' });
    await toast.present();
  }
}