import {
    Component,
    Input,
    OnChanges,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import SwiperCore, {
    Autoplay,
    EffectFade,
    Swiper,
    SwiperOptions,
} from 'swiper/core';
import { Functions, Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';

// install Swiper modules
SwiperCore.use([Autoplay, EffectFade]);

@Component({
    selector: 'app-purchase-schedule-01',
    templateUrl: './purchase-schedule-01.component.html',
    styleUrls: ['./purchase-schedule-01.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PurchaseSchedule01Component implements OnInit, OnChanges {
    public moment = moment;
    public environment = getEnvironment();
    public itemHeight: number;
    public screeningEventSeriesDisplayLength: number;
    public performanceDisplayLength: number;
    public pages: {
        group: {
            screeningEvent: factory.chevre.event.screeningEvent.IEvent;
            data: Models.Purchase.Performance[];
            empty: number[];
        }[];
        emptyGroup: {
            empty: number[];
        }[];
    }[];
    public swiperConfig: SwiperOptions;
    @Input()
    public screeningEvents: factory.chevre.event.screeningEvent.IEvent[];
    @Input() public direction: Models.Common.Direction;
    @Input() public page?: number;
    @Input() public image?: string;
    @Input() public color: Models.Common.Color;

    constructor() {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.swiperConfig = {
            spaceBetween: 0,
            autoplay:
                this.page === undefined
                    ? { delay: Number(this.environment.AUTOPLAY_DELAY_TIME) }
                    : undefined,
            loop: true,
            effect: this.page === undefined ? 'slide' : 'fade',
        };
    }

    public ngOnChanges() {
        this.itemHeight = 0;
        this.screeningEventSeriesDisplayLength = 0;
        this.performanceDisplayLength = 0;
        this.screeningEventSeriesDisplayLength =
            this.direction === Models.Common.Direction.HORIZONTAL ? 5 : 12;
        this.performanceDisplayLength =
            this.direction === Models.Common.Direction.HORIZONTAL ? 5 : 5;
        this.itemHeight =
            this.direction === Models.Common.Direction.HORIZONTAL
                ? (1080 - 60) / this.screeningEventSeriesDisplayLength
                : (1920 - 60) / this.screeningEventSeriesDisplayLength;
        this.pages = this.createPages();
    }

    public createPages() {
        const screeningEvents = this.screeningEvents;
        const now = moment().toDate();
        const screeningEventsGroup =
            Functions.Purchase.screeningEvents2ScreeningEventSeries({
                screeningEvents,
                now,
            });
        const pages: {
            group: {
                screeningEvent: factory.chevre.event.screeningEvent.IEvent;
                data: Models.Purchase.Performance[];
                empty: number[];
            }[];
            emptyGroup: {
                empty: number[];
            }[];
        }[] = [
            {
                group: [],
                emptyGroup: [],
            },
        ];
        let pageCount = 0;
        let eventCount = 0;
        const limit =
            this.screeningEventSeriesDisplayLength *
            this.performanceDisplayLength;
        screeningEventsGroup.forEach((group) => {
            group.data.forEach((d, i) => {
                if (pages[pageCount] === undefined) {
                    pages[pageCount] = {
                        group: [],
                        emptyGroup: [],
                    };
                }
                const findResult = pages[pageCount].group.find(
                    (g) =>
                        g.screeningEvent.superEvent.id ===
                        d.screeningEvent.superEvent.id
                );
                if (findResult === undefined) {
                    pages[pageCount].group.push({
                        screeningEvent: group.screeningEvent,
                        data: [d],
                        empty: [],
                    });
                } else {
                    findResult.data.push(d);
                }
                eventCount++;
                if (i + 1 === group.data.length) {
                    eventCount +=
                        this.performanceDisplayLength -
                        (group.data.length % this.performanceDisplayLength);
                }
                if (eventCount === limit) {
                    pageCount++;
                }
            });
        });
        pages.forEach((p) => {
            p.group.forEach((g) => {
                if (g.data.length % this.performanceDisplayLength === 0) {
                    return;
                }
                g.empty = [
                    ...Array(
                        this.performanceDisplayLength -
                            (g.data.length % this.performanceDisplayLength)
                    ).keys(),
                ];
            });
            p.emptyGroup = [
                ...Array(
                    this.screeningEventSeriesDisplayLength - p.group.length
                ).keys(),
            ].map(() => {
                return {
                    empty: [...Array(this.performanceDisplayLength).keys()],
                };
            });
        });
        return pages;
    }

    /**
     * swiperリサイズ
     */
    public resizeSwiper(swiper: Swiper) {
        swiper.update();
    }

    /**
     * swiper初期化
     */
    public initSwiper(swiper: Swiper) {
        if (this.page === undefined) {
            return;
        }
        swiper.slideTo(this.page, 0);
    }
}
