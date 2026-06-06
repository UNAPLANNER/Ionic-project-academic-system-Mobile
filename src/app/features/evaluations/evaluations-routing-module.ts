import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluationsPage } from './pages/evaluations.page';
import { EvaluationListPage } from './evaluation-list/evaluation-list.page';

const routes: Routes = [
  /*{
    path: '',
    component: EvaluationsPage
  }*/
  {
    path: '',
    component: EvaluationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationsRoutingModule { }
