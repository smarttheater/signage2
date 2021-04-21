import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, MasterService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-schedule',
    templateUrl: './purchase-schedule.component.html',
    styleUrls: ['./purchase-schedule.component.scss']
})
export class PurchaseScheduleComponent implements OnInit, OnDestroy {
    public isLoading: Observable<boolean>;
    public user: Observable<reducers.IUserState>;
    public error: Observable<string | null>;
    public moment = moment;
    public environment = getEnvironment();
    public screeningEvents: factory.chevre.event.screeningEvent.IEvent[];
    public updateTimer: any;
    public layout = Models.Common.Layout;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private masterService: MasterService,
        private actionService: ActionService,
        private utilService: UtilService
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        this.user = this.store.pipe(select(reducers.getUser));
        this.screeningEvents = [];
        try {
            await this.getSchedule();
            this.update();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * スケジュール取得
     */
    private async getSchedule() {
        const now = moment((await this.utilService.getServerTime()).date).toDate();
        const today = moment(moment(now).format('YYYYMMDD'), 'YYYYMMDD').toDate();
        const { movieTheater, screeningRoom, layout } = await this.actionService.user.getData();
        if (movieTheater === undefined) {
            throw new Error('movieTheater undefined');
        }
        const creativeWorks = await this.masterService.searchMovies({
            offers: { availableFrom: moment().toDate() }
        });
        const screeningEventSeries = (this.layout.TYPE01 === layout)
            ? await this.masterService.searchScreeningEventSeries({
                location: {
                    branchCode: { $eq: movieTheater.branchCode }
                },
                workPerformed: { identifiers: creativeWorks.map(c => c.identifier) }
            })
            : [];
        // const screeningRooms = (this.environment.PURCHASE_SCHEDULE_SORT === 'screen')
        //     ? await this.masterService.searchScreeningRooms({
        //         branchCode: { $eq: movieTheater.branchCode }
        //     })
        //     : [];
        const searchResult = await this.masterService.searchScreeningEvent({
            superEvent: { locationBranchCodes: [movieTheater.branchCode] },
            startFrom: moment(today).toDate(),
            startThrough: moment(today).add(1, 'day').add(-1, 'millisecond').toDate(),
            location: {
                branchCode: { $eq: screeningRoom?.branchCode }
            },
            creativeWorks,
            screeningEventSeries,
            // screeningRooms
        });
        this.screeningEvents = searchResult.filter(s => moment(s.endDate).unix() > moment().unix());
    }

    /**
     * 破棄
     */
    public ngOnDestroy() {
        clearTimeout(this.updateTimer);
    }

    /**
     * 更新
     */
    private update() {
        if (this.updateTimer !== undefined) {
            clearTimeout(this.updateTimer);
        }
        const time = 600000; // 10 * 60 * 1000
        this.updateTimer = setTimeout(async () => {
            try {
                await this.getSchedule();
            } catch (error) {
                console.error(error);
            }
            this.update();
        }, time);
    }

}
