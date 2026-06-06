import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'teacher',
    loadChildren: () => import('./features/teacher-tabs/teacher-tabs.module').then(m => m.TeacherTabsModule),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin-tabs/admin-tabs.module').then(m => m.AdminTabsModule),
    canActivate: [authGuard]
  },
  {
    path: 'student',
    loadChildren: () => import('./features/student-tabs/student-tabs.module').then(m => m.StudentTabsModule),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  },
  /*{
    path: 'evaluation-list',
    loadChildren: () => import('./features/evaluations/evaluation-list/evaluation-list.page').then( m => m.EvaluationListPage)
  }*/

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
