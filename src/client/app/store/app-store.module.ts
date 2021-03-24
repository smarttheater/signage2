import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MasterEffects } from './effects';
import { reducer } from './reducers';

@NgModule({
    imports: [
        StoreModule.forFeature('App', reducer),
        EffectsModule.forFeature([MasterEffects])
    ]
})
export class AppStoreModule { }
