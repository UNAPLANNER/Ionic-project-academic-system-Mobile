import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard-module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
    path: 'students',
    loadChildren: () => import('./features/students/students-module').then(m => m.StudentsModule),
    canActivate: [authGuard]
  },
  {
    path: 'courses',
    loadChildren: () => import('./features/courses/courses-module').then(m => m.CoursesModule),
    canActivate: [authGuard]
  },
  {
    path: 'evaluations',
    loadChildren: () => import('./features/evaluations/evaluations-module').then(m => m.EvaluationsModule),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
