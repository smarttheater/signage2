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
    public screeningEventDisplayLength: number;
    public itemHeight: number;
    @Input() public screeningEvents: factory.chevre.event.screeningEvent.IEvent[];
    @Input() public direction: Models.Common.Direction;
    @Input() public page?: number;

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
        this.pages = this.createPages();
    }

    public ngOnChanges() {
        this.pages = this.createPages();
        setTimeout(async () => {
            this.swiperInstance.update();
        }, 0);
    }

    public createPages() {
        const screeningEvents = this.screeningEvents;
        const pages: {
            data: Models.Purchase.Performance[];
            empty: any[];
        }[] = [];
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
        console.log(pages);
        pages.forEach(p => {
            p.empty = [...Array(this.screeningEventDisplayLength - p.data.length).keys()];
        });
        console.log(pages);
        return pages;
    }

    /**
     * リサイズ
     */
    public resize() {
        this.swiperInstance.update();
    }

}
