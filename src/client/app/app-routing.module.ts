/**
 * ルーティング
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getEnvironment } from '../environments/environment';
import { SettingGuardService } from './canActivates';
import { IndexComponent } from './index/index.component';
import { ErrorModule } from './modules/error/error.module';
import { MainModule } from './modules/main/main.module';
import { SettingModule } from './modules/setting/setting.module';

const appRoutes: Routes = [
    // { path: '', redirectTo: '/index', pathMatch: 'full' },
    { path: '', component: IndexComponent },
    {
        path: '',
        canActivate: [SettingGuardService],
        loadChildren: () => MainModule
    },
    {
        path: 'setting',
        canActivate: [],
        loadChildren: () => SettingModule
    },
    {
        path: '',
        loadChildren: () => ErrorModule
    }
];

// eslint-disable-next-line
@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { useHash: true, enableTracing: !getEnvironment().production, relativeLinkResolution: 'legacy' }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
