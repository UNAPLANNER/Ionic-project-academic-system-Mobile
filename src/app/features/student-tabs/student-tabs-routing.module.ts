import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentTabsPage } from './student-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: StudentTabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard-module').then(m => m.DashboardModule)
      },
      {
        path: 'courses',
        loadChildren: () => import('../courses/courses-module').then(m => m.CoursesModule)
      },
      {
        path: 'students',
        loadChildren: () => import('../students/students-module').then(m => m.StudentsModule)
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
export class StudentTabsRoutingModule {}
