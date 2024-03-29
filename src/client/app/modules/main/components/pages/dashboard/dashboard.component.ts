import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Functions } from '../../../../..';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    public isLoading: Observable<boolean>;
    public error: Observable<string | null>;
    public user: Observable<reducers.IUserState>;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        const { redirectUrl } = Functions.Util.getExternalData();
        if (redirectUrl !== undefined) {
            this.router.navigate([redirectUrl]);
            Functions.Util.getExternalData();
        }
        sessionStorage.removeItem('EXTERNAL');
    }
}
