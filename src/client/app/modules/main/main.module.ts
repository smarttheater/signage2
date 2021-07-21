import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { MainRootComponent } from './components/pages/main-root/main-root.component';
import { PurchaseScheduleComponent } from './components/pages/purchase-schedule/purchase-schedule.component';
import { PurchaseSchedule01Component } from './components/parts/purchase-schedule-01/purchase-schedule-01.component';
import { PurchaseSchedule02Component } from './components/parts/purchase-schedule-02/purchase-schedule-02.component';
import { PurchaseRoutingModule } from './main-routing.module';

@NgModule({
    declarations: [
        MainRootComponent,
        DashboardComponent,
        PurchaseScheduleComponent,
        PurchaseSchedule01Component,
        PurchaseSchedule02Component,
    ],
    entryComponents: [],
    imports: [CommonModule, PurchaseRoutingModule, SharedModule, SwiperModule],
    exports: [],
})
export class MainModule {}
