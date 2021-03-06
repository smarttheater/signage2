/**
 * ルーティング
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getEnvironment } from '../environments/environment';
import { ProjectGuardService, SettingGuardService } from './canActivates';
import { IndexComponent } from './index/index.component';
import { ErrorModule } from './modules/error/error.module';
import { MainModule } from './modules/main/main.module';
import { SettingModule } from './modules/setting/setting.module';

const appRoutes: Routes = [
    // { path: '', redirectTo: '/index', pathMatch: 'full' },
    { path: '', component: IndexComponent },
    {
        path: '',
        canActivate: [ProjectGuardService, SettingGuardService],
        loadChildren: () => MainModule
    },
    {
        path: 'setting',
        canActivate: [ProjectGuardService],
        loadChildren: () => SettingModule
    },
    {
        path: '',
        loadChildren: () => ErrorModule
    }
];

// tslint:disable-next-line:no-stateless-class
@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { useHash: true, enableTracing: !getEnvironment().production }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
