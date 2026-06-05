import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTabsPage } from './admin-tabs.page';
import { roleGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminTabsPage,
    canActivate: [roleGuard(['admin'])],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard-module').then(m => m.DashboardModule)
      },
      {
        path: 'teachers/new',
        loadComponent: () => import('../teachers/teacher-form/teacher-form.page').then(m => m.TeacherFormPage)
      },
      {
        path: 'teachers',
        loadComponent: () => import('../teachers/teachers-list/teachers-list.page').then(m => m.TeachersListPage)
      },
      {
        path: 'students',
        loadChildren: () => import('../students/students-module').then(m => m.StudentsModule)
      },
      {
        path: 'courses',
        loadChildren: () => import('../courses/courses-module').then(m => m.CoursesModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTabsRoutingModule {}
