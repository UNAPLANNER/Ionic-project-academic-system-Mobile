import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsListPage } from './students-list/students-list.page';
import { StudentFormPage } from './student-form/student-form.page';

const routes: Routes = [
  {
    path: '',
    component: StudentsListPage
  },
  {
    path: 'new',
    component: StudentFormPage
  },
  {
    path: 'edit/:id',
    component: StudentFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
