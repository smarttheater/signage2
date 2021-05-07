import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-purchase-schedule-02',
    templateUrl: './purchase-schedule-02.component.html',
    styleUrls: ['./purchase-schedule-02.component.scss']
})
export class PurchaseSchedule02Component implements OnInit, OnChanges {
    public moment = moment;
    public environment = getEnvironment();
    public swiperInstance: any;
    public pages: {
        data: Models.Purchase.Performance[];
        empty: any[];
    }[];
    public isOpacity: boolean;
    public screeningEventDisplayLength: number;
    public itemHeight: number;
    @Input() public screeningEvents: factory.chevre.event.screeningEvent.IEvent[];
    @Input() public direction: Models.Common.Direction;
    @Input() public page?: number;
    @Input() public image?: string;
    @Input() public color: Models.Common.Color;

    constructor() { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.itemHeight = 0;
        this.screeningEventDisplayLength = 0;
        this.screeningEventDisplayLength = (this.direction === Models.Common.Direction.HORIZONTAL)
            ? 5 : 12;
        this.itemHeight = (this.direction === Models.Common.Direction.HORIZONTAL)
            ? (1080 - 60) / this.screeningEventDisplayLength
            : (1920 - 60) / this.screeningEventDisplayLength;
        const swiperConfig = {
            spaceBetween: 0,
            autoplay: (this.page === undefined)
                ? { delay: this.environment.AUTOPLAY_DELAY_TIME }
                : undefined,
            effect: 'fade', // (this.page === undefined) ? 'slide' : 'fade',
        };
        this.swiperInstance = new (<any>window).Swiper('.swiper-container', swiperConfig);
        this.isOpacity = false;
    }

    public ngOnChanges() {
        if (this.swiperInstance === undefined) {
            return;
        }
        this.isOpacity = true;
        this.swiperInstance.autoplay.stop();
        this.pages = this.createPages();
        setTimeout(async () => {
            this.swiperInstance.update();
            this.isOpacity = false;
            if (this.page === undefined) {
                this.swiperInstance.autoplay.start();
                return;
            }
            this.swiperInstance.slideTo(this.page - 1, 0);
        }, 0);
    }

    public createPages() {
        const screeningEvents = this.screeningEvents;
        const pages: {
            data: Models.Purchase.Performance[];
            empty: any[];
        }[] = [{
            data: [],
            empty: []
        }];
        let pageCount = 0;
        screeningEvents.forEach((s, i) => {
            if (pages[pageCount] === undefined) {
                pages[pageCount] = {
                    data: [],
                    empty: []
                };
            }
            pages[pageCount].data.push(new Models.Purchase.Performance({ screeningEvent: s }));
            if (i > 1
                && (i + 1) % this.screeningEventDisplayLength === 0) {
                pageCount++;
            }
        });
        pages.forEach(p => {
            p.empty = [...Array(this.screeningEventDisplayLength - p.data.length).keys()];
        });
        return pages;
    }

    /**
     * リサイズ
     */
    public resize() {
        this.swiperInstance.update();
    }

}
