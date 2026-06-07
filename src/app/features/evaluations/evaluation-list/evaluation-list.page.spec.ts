import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationListPage } from './evaluation-list.page';

describe('EvaluationListPage', () => {
  let component: EvaluationListPage;
  let fixture: ComponentFixture<EvaluationListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
