import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CinemaDashboardComponent } from './components/pages/cinema/cinema-dashboard/cinema-dashboard.component';
import { CinemaPurchaseScheduleComponent } from './components/pages/cinema/cinema-purchase-schedule/cinema-purchase-schedule.component';
import { MainRootComponent } from './components/pages/main-root/main-root.component';
import { PurchaseRoutingModule } from './main-routing.module';



@NgModule({
  declarations: [
    MainRootComponent,
    CinemaDashboardComponent,
    CinemaPurchaseScheduleComponent,
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
