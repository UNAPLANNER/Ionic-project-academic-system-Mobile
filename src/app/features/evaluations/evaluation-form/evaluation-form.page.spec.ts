import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationFormPage } from './evaluation-form.page';

describe('EvaluationFormPage', () => {
  let component: EvaluationFormPage;
  let fixture: ComponentFixture<EvaluationFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
