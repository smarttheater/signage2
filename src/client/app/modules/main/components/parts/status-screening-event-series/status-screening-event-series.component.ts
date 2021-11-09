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
    selector: 'app-status-screening-event-series',
    templateUrl: './status-screening-event-series.component.html',
    styleUrls: ['./status-screening-event-series.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class StatusScreeningEventSeriesComponent implements OnInit, OnChanges {
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
    @Input()
    public settings: {
        direction: Models.Common.Direction;
        page?: number;
        image?: string;
        color: Models.Common.Color;
        period: number;
        dateFormat: 'YYYY/MM/DD HH:mm' | 'MM/DD HH:mm' | 'HH:mm';
    };

    constructor() {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.swiperConfig = {
            allowSlidePrev: false,
            spaceBetween: 0,
            autoplay:
                this.settings.page === undefined
                    ? { delay: Number(this.environment.AUTOPLAY_DELAY_TIME) }
                    : undefined,
            loop: true,
            effect: this.settings.page === undefined ? 'slide' : 'fade',
        };
    }

    public ngOnChanges() {
        this.itemHeight = 0;
        this.screeningEventSeriesDisplayLength = 0;
        this.performanceDisplayLength = 0;
        this.screeningEventSeriesDisplayLength =
            this.settings.direction === Models.Common.Direction.HORIZONTAL
                ? 5
                : 12;
        this.performanceDisplayLength =
            this.settings.direction === Models.Common.Direction.HORIZONTAL
                ? 5
                : 5;
        this.itemHeight =
            this.settings.direction === Models.Common.Direction.HORIZONTAL
                ? (1080 - 60) / this.screeningEventSeriesDisplayLength
                : (1920 - 60) / this.screeningEventSeriesDisplayLength;
        this.pages = this.createPages();
        // console.log('this.pages', this.pages);
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
                if (
                    i + 1 === group.data.length &&
                    group.data.length % this.performanceDisplayLength !== 0
                ) {
                    eventCount +=
                        this.performanceDisplayLength -
                        (group.data.length % this.performanceDisplayLength);
                }
                if (eventCount % limit === 0) {
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
                    this.screeningEventSeriesDisplayLength - p.group.length > 0
                        ? this.screeningEventSeriesDisplayLength -
                              p.group.length
                        : 0
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
        if (this.settings.page === undefined) {
            return;
        }
        swiper.slideTo(this.settings.page, 0);
    }
}
