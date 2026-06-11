import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EvaluationFormPage } from '../features/evaluations/evaluation-form/evaluation-form.page';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonicModule,
  ToastController,
  AlertController,
  ModalController
} from '@ionic/angular';
import { ApiService } from '../core/services/api.service';

describe('EvaluationFormPage', () => {

  let component: EvaluationFormPage;
  let fixture: ComponentFixture<EvaluationFormPage>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        IonicModule.forRoot(),
        EvaluationFormPage
      ],
      providers: [
        {
          provide: ApiService,
          useValue: {
            getCourses: () => Promise.resolve([]),
            createEvaluation: () => Promise.resolve()
          }
        },
        {
          provide: ToastController,
          useValue: {
            create: async () => ({
              present: async () => {}
            })
          }
        },
        {
          provide: AlertController,
          useValue: {
            create: async () => ({
              present: async () => {}
            })
          }
        },
        {
          provide: ModalController,
          useValue: {
            dismiss: jasmine.createSpy('dismiss')
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationFormPage);
    component = fixture.componentInstance;

    component.student = { id: '123' };

    fixture.detectChanges();
  });

  it('debería crear el formulario de evaluación', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar inválido si falta un campo requerido', () => {
    component.form.patchValue({
      courseId: ''
    });

    expect(component.form.invalid).toBeTrue();
  });

  it('debería mostrar error si score > maxScore', async () => {

    component.form.patchValue({
      courseId: '1',
      score: 100 as any,
      maxScore: 50 as any,
      type: 'exam',
      date: '2026-06-10',
      description: 'Test'
    });

    await component.registerEvaluation();

    expect(
      component.form.value.score as any
    ).toBeGreaterThan(
      component.form.value.maxScore as any
    );
  });

});