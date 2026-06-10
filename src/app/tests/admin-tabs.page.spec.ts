import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminTabsPage } from '../features/admin-tabs/admin-tabs.page';

describe('AdminTabsPage', () => {
  let fixture: ComponentFixture<AdminTabsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTabsPage],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTabsPage);
    fixture.detectChanges();
  });

  it('debe crear la pagina de tabs del administrador', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra las opciones principales del administrador', () => {
    const host: HTMLElement = fixture.nativeElement;
    const text = host.textContent ?? '';
    const tabs = Array.from(
      host.querySelectorAll('ion-tab-button')
    ) as HTMLElement[];

    expect(text).toContain('Inicio');
    expect(text).toContain('Profesores');
    expect(text).toContain('Estudiantes');
    expect(text).toContain('Cursos');
    expect(tabs.map(tab => tab.getAttribute('tab'))).toEqual([
      'dashboard',
      'teachers',
      'students',
      'courses'
    ]);
  });

  it('no muestra opciones fuera del menu administrativo', () => {
    const host: HTMLElement = fixture.nativeElement;
    const tabs = Array.from(
      host.querySelectorAll('ion-tab-button')
    ) as HTMLElement[];

    expect(tabs.map(tab => tab.getAttribute('tab'))).not.toContain('evaluations');
    expect(tabs.map(tab => tab.getAttribute('tab'))).not.toContain('profile');
  });
});
