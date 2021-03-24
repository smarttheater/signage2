import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from '../shared/components/pages/base/base.component';
import { SettingComponent } from './components/pages/setting/setting.component';


const routes: Routes = [{
  path: '',
  component: BaseComponent,
  children: [
    { path: '', component: SettingComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
