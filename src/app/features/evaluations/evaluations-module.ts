import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { EvaluationsRoutingModule } from './evaluations-routing-module';
//import { EvaluationsPage } from './pages/evaluations.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EvaluationsRoutingModule
  ]
})
export class EvaluationsModule { }
