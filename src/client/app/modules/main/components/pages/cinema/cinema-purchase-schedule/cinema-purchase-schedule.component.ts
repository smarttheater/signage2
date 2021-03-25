import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../../../../..';
import { getEnvironment } from '../../../../../../../environments/environment';
import { ActionService, MasterService, UtilService } from '../../../../../../services';
import * as reducers from '../../../../../../store/reducers';

@Component({
    selector: 'app-cinema-purchase-schedule',
    templateUrl: './cinema-purchase-schedule.component.html',
    styleUrls: ['./cinema-purchase-schedule.component.scss']
})
export class CinemaPurchaseScheduleComponent implements OnInit, OnDestroy {
    public isLoading: Observable<boolean>;
    public error: Observable<string | null>;
    public moment = moment;
    public environment = getEnvironment();
    public pages: {
        group: {
            screeningEvent: factory.chevre.event.screeningEvent.IEvent;
            data: Models.Purchase.Performance[];
            empty: any[];
        }[];
        emptyGroup: {
            empty: any[];
        }[];
    }[];
    public updateTimer: any;
    public swiperInstance: any;

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
        this.pages = [];
        try {
            const { page } = await this.actionService.user.getData();
            const swiperConfig: any = {
                spaceBetween: 0,
                autoplay: (page === undefined) ? { delay: 10000 } : undefined,
                effect: 'flip',
            };
            this.swiperInstance = new (<any>window).Swiper('.swiper-container', swiperConfig);
            await this.getSchedule();
            this.update();
            setTimeout(async () => {
                this.swiperInstance.update();
                if (page !== undefined) {
                    this.swiperInstance.slideTo(page, 0);
                }
            }, 0);
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
        const { movieTheater, screeningRoom } = await this.actionService.user.getData();
        if (movieTheater === undefined) {
            throw new Error('movieTheater undefined');
        }
        const creativeWorks = await this.masterService.searchMovies({
            offers: { availableFrom: moment().toDate() }
        });
        const screeningEventSeries = (this.environment.PURCHASE_SCHEDULE_SORT === 'screeningEventSeries')
            ? await this.masterService.searchScreeningEventSeries({
                location: {
                    branchCode: { $eq: movieTheater.branchCode }
                },
                workPerformed: { identifiers: creativeWorks.map(c => c.identifier) }
            })
            : [];
        const screeningRooms = (this.environment.PURCHASE_SCHEDULE_SORT === 'screen')
            ? await this.masterService.searchScreeningRooms({
                branchCode: { $eq: movieTheater.branchCode }
            })
            : [];
        const screeningEvents = await this.masterService.searchScreeningEvent({
            superEvent: { locationBranchCodes: [movieTheater.branchCode] },
            startFrom: moment(today).toDate(),
            startThrough: moment(today).add(1, 'day').add(-1, 'millisecond').toDate(),
            location: {
                branchCode: { $eq: screeningRoom?.branchCode }
            },
            creativeWorks,
            screeningEventSeries,
            screeningRooms
        });
        const screeningEventsGroup =
            Functions.Purchase.screeningEvents2ScreeningEventSeries({ screeningEvents, now });
        const pages: {
            group: {
                screeningEvent: factory.chevre.event.screeningEvent.IEvent;
                data: Models.Purchase.Performance[];
                empty: any[];
            }[];
            emptyGroup: {
                empty: any[];
            }[];
        }[] = [];
        let pageCount = 0;
        let eventCount = 0;
        const SCREENING_EVENT_SERIES_DISPLAY_LENGTH = 5;
        const PERFORMANCE_DISPLAY_LENGTH = 5;
        screeningEventsGroup.forEach((s, i) => {
            if (pages[pageCount] === undefined) {
                pages[pageCount] = {
                    group: [],
                    emptyGroup: []
                };
            }
            new Array(5).forEach(() => {
                console.log({ test: 0 });
            });
            const empty = [...Array(PERFORMANCE_DISPLAY_LENGTH - (s.data.length % PERFORMANCE_DISPLAY_LENGTH)).keys()];
            pages[pageCount].group.push({ ...s, empty });
            eventCount += Math.ceil(s.data.length / PERFORMANCE_DISPLAY_LENGTH);
            if (eventCount === PERFORMANCE_DISPLAY_LENGTH
                || screeningEventsGroup.length === i + 1) {
                pages[pageCount].emptyGroup =
                    [...Array(SCREENING_EVENT_SERIES_DISPLAY_LENGTH - eventCount).keys()]
                        .map(() => {
                            return { empty: [...Array(PERFORMANCE_DISPLAY_LENGTH).keys()] };
                        });
                pageCount++;
                eventCount = 0;
            }
        });
        this.pages = pages;
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

    /**
     * リサイズ
     */
    public resize() {
        this.swiperInstance.update();
    }

}
