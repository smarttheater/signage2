import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { MainRootComponent } from './components/pages/main-root/main-root.component';
import { PurchaseStatusSeatComponent } from './components/pages/purchase-status-seat/purchase-status-seat.component';
import { PurchaseStatusComponent } from './components/pages/purchase-status/purchase-status.component';
import { ScreenComponent } from './components/parts/screen/screen.component';
import { StatusScreeningEventSeriesComponent } from './components/parts/status-screening-event-series/status-screening-event-series.component';
import { StatusSeatComponent } from './components/parts/status-seat/status-seat.component';
import { StatusStartDateComponent } from './components/parts/status-start-date/status-start-date.component';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
    declarations: [
        MainRootComponent,
        DashboardComponent,
        PurchaseStatusComponent,
        PurchaseStatusSeatComponent,
        StatusScreeningEventSeriesComponent,
        StatusStartDateComponent,
        StatusSeatComponent,
        ScreenComponent,
    ],
    entryComponents: [],
    imports: [CommonModule, MainRoutingModule, SharedModule, SwiperModule],
    exports: [],
})
export class MainModule {}
