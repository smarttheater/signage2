import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import {
    ActionService,
    MasterService,
    UtilService,
} from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-status',
    templateUrl: './purchase-status.component.html',
    styleUrls: ['./purchase-status.component.scss'],
})
export class PurchaseStatusComponent implements OnInit, OnDestroy {
    public isLoading: Observable<boolean>;
    public user: Observable<reducers.IUserState>;
    public error: Observable<string | null>;
    public moment = moment;
    public environment = getEnvironment();
    public screeningEvents?: factory.chevre.event.screeningEvent.IEvent[];
    public updateTimer: any;
    public layout: Models.Common.Layout;
    public Layout = Models.Common.Layout;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private masterService: MasterService,
        private actionService: ActionService,
        private utilService: UtilService,
        private activatedRoute: ActivatedRoute
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        this.user = this.store.pipe(select(reducers.getUser));
        this.layout = this.activatedRoute.snapshot.params.layout;
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
        const now = moment(
            (await this.utilService.getServerTime()).date
        ).toDate();
        const today = moment(
            moment(now).format('YYYYMMDD'),
            'YYYYMMDD'
        ).toDate();
        const { movieTheater, screeningRoom } =
            await this.actionService.user.getData();
        if (movieTheater === undefined) {
            throw new Error('movieTheater undefined');
        }
        const creativeWorks = await this.masterService.searchMovies({
            offers: { availableFrom: moment().toDate() },
        });
        const screeningEventSeries =
            this.layout === Models.Common.Layout.SCREENING_EVENT_SERIES
                ? await this.masterService.searchScreeningEventSeries({
                      location: {
                          branchCode: { $eq: movieTheater.branchCode },
                      },
                      workPerformed: {
                          identifiers: creativeWorks.map((c) => c.identifier),
                      },
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
            startThrough: moment(today)
                .add(1, 'day')
                .add(-1, 'millisecond')
                .toDate(),
            location: {
                branchCode: { $eq: screeningRoom?.branchCode },
            },
            creativeWorks,
            screeningEventSeries,
            // screeningRooms
        });
        this.screeningEvents = searchResult.filter(
            (s) => moment(s.endDate).unix() > moment().unix()
        );
        // this.screeningEvents = searchResult;
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
        const time = Number(this.environment.UPDATE_DELAY_TIME); // 10 * 60 * 1000
        this.updateTimer = setTimeout(async () => {
            try {
                await this.actionService.user.checkVersion();
            } catch (error) {
                console.error(error);
            }
            try {
                await this.getSchedule();
            } catch (error) {
                console.error(error);
            }
            this.update();
        }, time);
    }
}
