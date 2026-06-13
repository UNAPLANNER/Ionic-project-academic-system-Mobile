import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ApiService } from '../core/services/api.service';
import { Course } from '../core/models/course.model';
import { AuthService } from '../features/auth/services/auth.service';
import { CoursesPage } from '../features/courses/pages/courses.page';

describe('CoursesPage', () => {
  let component: CoursesPage;
  let fixture: ComponentFixture<CoursesPage>;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toastController: jasmine.SpyObj<ToastController>;

  const courses: Course[] = [
    {
      id: 'course-1',
      name: 'Matematica Discreta',
      code: 'MAT101',
      teacherId: 'teacher-1',
      credits: 4,
      schedule: 'Lunes 08:00-10:00',
      totalStudents: 12
    },
    {
      id: 'course-2',
      name: 'Programacion Movil',
      code: 'MOV202',
      teacherId: 'teacher-2',
      credits: 3,
      schedule: 'Martes 18:00-20:00',
      students: ['student-1', 'student-2']
    }
  ];

  beforeEach(async () => {
    apiService = jasmine.createSpyObj<ApiService>('ApiService', [
      'getCourses',
      'createCourse',
      'updateCourse',
      'deleteCourse',
      'getTeachers',
      'updateCourseTeacher'
    ]);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    toastController = jasmine.createSpyObj<ToastController>('ToastController', ['create']);
    const alertController = jasmine.createSpyObj<AlertController>('AlertController', ['create']);

    apiService.getCourses.and.resolveTo(courses);
    apiService.createCourse.and.resolveTo(courses[0]);
    apiService.updateCourse.and.resolveTo(courses[1]);
    toastController.create.and.resolveTo({ present: jasmine.createSpy('present') } as any);
    alertController.create.and.resolveTo({ present: jasmine.createSpy('present') } as any);

    await TestBed.configureTestingModule({
      imports: [CoursesPage],
      providers: [
        FormBuilder,
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: AlertController, useValue: alertController },
        { provide: ToastController, useValue: toastController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesPage);
    component = fixture.componentInstance;
  });

  it('habilita la gestion de cursos para el administrador', async () => {
    authService.getCurrentUser.and.returnValue({
      id: 'admin-1',
      name: 'Admin',
      email: 'admin@test.com',
      role: 'admin'
    });

    component.ngOnInit();
    await fixture.whenStable();

    expect(component.canManage).toBeTrue();
    expect(component.canViewCourseStudents).toBeTrue();
    expect(component.courses).toEqual(courses);
    expect(apiService.getCourses).toHaveBeenCalled();
  });

  it('no permite abrir el formulario de creacion si el usuario no es administrador', () => {
    authService.getCurrentUser.and.returnValue({
      id: 'student-1',
      name: 'Estudiante',
      email: 'student@test.com',
      role: 'student'
    });

    component.ngOnInit();
    component.openCreate();

    expect(component.canManage).toBeFalse();
    expect(component.formMode).toBe('list');
  });

  it('filtra cursos por nombre, codigo u horario', () => {
    component.courses = courses;
    component.searchTerm = 'mov';

    expect(component.filteredCourses).toEqual([courses[1]]);

    component.searchTerm = 'MAT101';
    expect(component.filteredCourses).toEqual([courses[0]]);
  });

  it('navega a estudiantes del curso usando la ruta del administrador', () => {
    component.userRole = 'admin';
    component.canViewCourseStudents = true;

    component.openStudents(courses[0]);

    expect(router.navigate).toHaveBeenCalledWith(
      ['/admin/courses', 'course-1', 'students'],
      { state: { course: courses[0] } }
    );
  });

  it('crea un curso con los datos del formulario y horario seleccionado', async () => {
    component.canManage = true;
    component.openCreate();
    component.courseForm.patchValue({
      name: 'Bases de Datos',
      code: 'BD101',
      credits: 4
    });
    component.scheduleEntries.at(0).patchValue({
      day: 'Lunes',
      startTime: '07:00',
      endTime: '09:00'
    });

    await component.saveCourse();

    expect(apiService.createCourse).toHaveBeenCalledWith({
      name: 'Bases de Datos',
      code: 'BD101',
      credits: 4,
      schedule: 'Lunes 07:00-09:00'
    });
    expect(component.formMode).toBe('list');
  });

  it('muestra error cuando se intenta guardar sin dias seleccionados', async () => {
    component.canManage = true;
    component.openCreate();
    component.courseForm.patchValue({
      name: 'Redes',
      code: 'RED101',
      credits: 3
    });
    component.scheduleEntries.clear();

    await component.saveCourse();

    expect(apiService.createCourse).not.toHaveBeenCalled();
    expect(toastController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Selecciona al menos un dia',
      color: 'danger'
    }));
  });

  it('calcula la cantidad de estudiantes inscritos', () => {
    expect(component.getEnrolledCount(courses[0])).toBe(12);
    expect(component.getEnrolledCount(courses[1])).toBe(2);
  });
});
