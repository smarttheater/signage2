import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from '../shared/components/pages/base/base.component';
import { ErrorComponent } from './pages/error/error.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';


const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: 'maintenance', component: MaintenanceComponent },
      { path: 'error', component: ErrorComponent },
      { path: '**', component: NotfoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
