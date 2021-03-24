import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as reducers from '../../../../../../store/reducers';

@Component({
    selector: 'app-cinema-dashboard',
    templateUrl: './cinema-dashboard.component.html',
    styleUrls: ['./cinema-dashboard.component.scss']
})
export class CinemaDashboardComponent implements OnInit {
    public isLoading: Observable<boolean>;
    public error: Observable<string | null>;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        try {

        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

}
