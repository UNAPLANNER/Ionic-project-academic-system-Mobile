import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AdminTabsRoutingModule } from './admin-tabs-routing.module';
import { AdminTabsPage } from './admin-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AdminTabsRoutingModule,
    AdminTabsPage
  ]
})
export class AdminTabsModule {}
