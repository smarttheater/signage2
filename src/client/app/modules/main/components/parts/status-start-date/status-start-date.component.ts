import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import SwiperCore, {
    Autoplay,
    EffectFade,
    Swiper,
    SwiperOptions,
} from 'swiper';
import { Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';

// install Swiper modules
SwiperCore.use([Autoplay, EffectFade]);

@Component({
    selector: 'app-status-start-date',
    templateUrl: './status-start-date.component.html',
    styleUrls: ['./status-start-date.component.scss'],
})
export class StatusStartDateComponent implements OnInit, OnChanges {
    public moment = moment;
    public environment = getEnvironment();
    public pages: {
        data: Models.Purchase.Performance[];
        empty: number[];
    }[];
    public screeningEventDisplayLength: number;
    public itemHeight: number;
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
        this.screeningEventDisplayLength = 0;
        this.screeningEventDisplayLength =
            this.settings.direction === Models.Common.Direction.HORIZONTAL
                ? 5
                : 12;
        this.itemHeight =
            this.settings.direction === Models.Common.Direction.HORIZONTAL
                ? (1080 - 60) / this.screeningEventDisplayLength
                : (1920 - 60) / this.screeningEventDisplayLength;
        this.pages = this.createPages();
    }

    public createPages() {
        const screeningEvents = this.screeningEvents;
        const pages: {
            data: Models.Purchase.Performance[];
            empty: any[];
        }[] = [
            {
                data: [],
                empty: [],
            },
        ];
        let pageCount = 0;
        screeningEvents.forEach((s, i) => {
            if (pages[pageCount] === undefined) {
                pages[pageCount] = {
                    data: [],
                    empty: [],
                };
            }
            pages[pageCount].data.push(
                new Models.Purchase.Performance({ screeningEvent: s })
            );
            if (i > 1 && (i + 1) % this.screeningEventDisplayLength === 0) {
                pageCount++;
            }
        });
        pages.forEach((p) => {
            p.empty = [
                ...Array(
                    this.screeningEventDisplayLength - p.data.length
                ).keys(),
            ];
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
