import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './pages/error/error.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';


@NgModule({
  declarations: [
    MaintenanceComponent,
    ErrorComponent,
    NotfoundComponent
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    SharedModule,
  ]
})
export class ErrorModule { }
