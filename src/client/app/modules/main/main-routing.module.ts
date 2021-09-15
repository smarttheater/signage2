import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from '../shared/components/pages/base/base.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { MainRootComponent } from './components/pages/main-root/main-root.component';
import { PurchaseStatusSeatComponent } from './components/pages/purchase-status-seat/purchase-status-seat.component';
import { PurchaseStatusComponent } from './components/pages/purchase-status/purchase-status.component';

const routes: Routes = [
    {
        path: '',
        component: BaseComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'purchase/status/seat',
                component: PurchaseStatusSeatComponent,
            },
            {
                path: 'purchase/status/:layout',
                component: PurchaseStatusComponent,
            },
        ],
    },
    { path: 'root', component: MainRootComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MainRoutingModule {}
