import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationListPage } from '../features/evaluations/evaluation-list/evaluation-list.page';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

describe('EvaluationListPage', () => {
  let component: EvaluationListPage;
  let fixture: ComponentFixture<EvaluationListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule, EvaluationListPage],
      providers: [
        { provide: ApiService, useValue: { getStudentEvaluations: () => Promise.resolve({ evaluations: [], average: 0 }), getCourses: () => Promise.resolve([]) } },
        { provide: AuthService, useValue: { getCurrentUser: () => ({ id: '123', role: 'student' }) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '123']]) } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear la lista de evaluaciones', () => {
    expect(component).toBeTruthy();
  });

  it('debería asignar studentId si el usuario es estudiante', () => {
    component.setStudentId();
    expect(component.studentId).toBe('123');
  });

  it('debería traducir tipo de evaluación a español', () => {
    const result = component.getEvaluationType('exam');
    expect(result).toBe('EXAMEN');
  });

  it('debería calcular porcentaje de nota', () => {
    const ev = { score: 80, maxScore: 100 } as any;
    const percent = component.scorePercent(ev);
    expect(percent).toBe(80);
  });

  it('debería devolver estilo verde si el porcentaje es >= 80', () => {
    const ev = { score: 90, maxScore: 100 } as any;
    const style = component.getEvaluationCardStyle(ev);
    expect(style.background).toContain('#4CAF50');
  });
});
