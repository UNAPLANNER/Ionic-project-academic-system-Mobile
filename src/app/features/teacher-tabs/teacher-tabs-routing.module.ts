import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherTabsPage } from './teacher-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TeacherTabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard-module').then(m => m.DashboardModule)
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
        path: 'evaluations',
        loadChildren: () => import('../evaluations/evaluations-module').then(m => m.EvaluationsModule)
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
export class TeacherTabsRoutingModule {}
