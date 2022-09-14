import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-purchase-status-seat',
    templateUrl: './purchase-status-seat.component.html',
    styleUrls: ['./purchase-status-seat.component.scss'],
})
export class PurchaseStatusSeatComponent implements OnInit, OnDestroy {
    public isLoading: Observable<boolean>;
    public user: Observable<reducers.IUserState>;
    public error: Observable<string | null>;
    public moment = moment;
    public environment = getEnvironment();
    public data: {
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
        screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];
    }[];
    public updateTimer: any;

    constructor(
        private store: Store<reducers.IState>,
        private router: Router,
        private actionService: ActionService,
        private utilService: UtilService
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.error = this.store.pipe(select(reducers.getError));
        this.user = this.store.pipe(select(reducers.getUser));
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
        const { settings } = await this.actionService.user.getData();
        const { movieTheater, screeningRoom, period } = settings;
        if (movieTheater === undefined) {
            throw new Error('movieTheater undefined');
        }
        const searchScreeningRoomsResult =
            await this.actionService.place.searchScreeningRooms({
                containedInPlace: {
                    branchCode: { $eq: movieTheater.branchCode },
                },
            });
        const creativeWorks =
            await this.actionService.creativeWork.searchMovies({
                offers: { availableFrom: moment().toDate() },
            });
        const searchScreeningEventResult =
            await this.actionService.event.searchScreeningEvent({
                superEvent: { locationBranchCodes: [movieTheater.branchCode] },
                startFrom: moment(today).toDate(),
                startThrough: moment(today)
                    .add(period, 'seconds')
                    .add(-1, 'millisecond')
                    .toDate(),
                location: {
                    branchCode: { $eq: screeningRoom?.branchCode },
                },
                creativeWorks,
                superEventLocationBranchCode: movieTheater.branchCode,
                // screeningRooms
            });
        const screeningEvents = searchScreeningEventResult
            .filter((s) => moment(s.endDate).unix() > moment().unix())
            .filter((s) => {
                const performance = new Models.Purchase.Performance({
                    screeningEvent: s,
                });
                return (
                    performance.isTicketedSeat() &&
                    !performance.isInfinitetock()
                );
            })
            .filter((s) => {
                const findResult = searchScreeningRoomsResult.find(
                    (r) => r.branchCode === s.location.branchCode
                );
                return (
                    findResult !== undefined && !findResult.openSeatingAllowed
                );
            });
        const data: {
            screeningEvent: factory.chevre.event.screeningEvent.IEvent;
            screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];
        }[] = [];
        for (const screeningEvent of screeningEvents) {
            const screeningEventSeats =
                await this.actionService.event.searchSeats({
                    screeningEvent,
                    eventId: screeningEvent.id,
                });
            data.push({
                screeningEvent,
                screeningEventSeats,
            });
        }
        this.data = data;
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
