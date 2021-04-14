import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { MainRootComponent } from './components/pages/main-root/main-root.component';
import { PurchaseScheduleComponent } from './components/pages/purchase-schedule/purchase-schedule.component';
import { PurchaseRoutingModule } from './main-routing.module';



@NgModule({
  declarations: [
    MainRootComponent,
    DashboardComponent,
    PurchaseScheduleComponent,
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    SharedModule,
  ],
  exports: []
})
export class MainModule { }
