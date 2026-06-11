import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from '../features/dashboard/pages/dashboard.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';

import { AuthService } from '../features/auth/services/auth.service';
import { ApiService } from '../core/services/api.service';

describe('DashboardPage', () => {

  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async () => {

    const authServiceMock = {
      currentUser$: of({
        id: '123',
        role: 'student'
      }),
      logout: jasmine.createSpy('logout')
    };

    const apiServiceMock = {
      getCourses: jasmine.createSpy('getCourses')
        .and.returnValue(Promise.resolve([])),

      getStudentEvaluations: jasmine.createSpy('getStudentEvaluations')
        .and.returnValue(
          Promise.resolve({
            evaluations: []
          })
        ),

      getStudents: jasmine.createSpy('getStudents')
        .and.returnValue(Promise.resolve([])),

      getTeachers: jasmine.createSpy('getTeachers')
        .and.returnValue(Promise.resolve([])),

      getDashboardMetrics: jasmine.createSpy('getDashboardMetrics')
        .and.returnValue(Promise.resolve({})),

      getDashboardPerformance: jasmine.createSpy('getDashboardPerformance')
        .and.returnValue(Promise.resolve([]))
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    const alertMock = {
      create: jasmine.createSpy('create')
        .and.returnValue(
          Promise.resolve({
            present: jasmine.createSpy('present')
          })
        )
    };

    await TestBed.configureTestingModule({
      imports: [
        DashboardPage,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: AlertController, useValue: alertMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('debería crear la página de dashboard', () => {
    expect(component).toBeTruthy();
  });

});