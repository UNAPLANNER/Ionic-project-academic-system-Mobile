import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsListPage } from './students-list/students-list.page';
import { StudentFormPage } from './student-form/student-form.page';
import { roleGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: StudentsListPage
  },
  {
    path: 'new',
    component: StudentFormPage,
    canActivate: [roleGuard(['admin'])]
  },
  {
    path: 'edit/:id',
    component: StudentFormPage,
    canActivate: [roleGuard(['admin'])]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
