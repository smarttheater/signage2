import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewTypeGuardService } from '../../canActivates';
import { BaseComponent } from '../shared/components/pages/base/base.component';
import { CinemaDashboardComponent } from './components/pages/cinema/cinema-dashboard/cinema-dashboard.component';
import { CinemaPurchaseScheduleComponent } from './components/pages/cinema/cinema-purchase-schedule/cinema-purchase-schedule.component';
import { MainRootComponent } from './components/pages/main-root/main-root.component';


const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: 'cinema',
        canActivate: [ViewTypeGuardService],
        children: [
          { path: 'dashboard', component: CinemaDashboardComponent },
          { path: 'purchase/schedule', component: CinemaPurchaseScheduleComponent },
        ]
      },
    ]
  },
  { path: 'root', component: MainRootComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
