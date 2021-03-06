import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { factory } from '@cinerino/sdk';
import * as moment from 'moment';
import { Functions, Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-purchase-schedule-01',
    templateUrl: './purchase-schedule-01.component.html',
    styleUrls: ['./purchase-schedule-01.component.scss']
})
export class PurchaseSchedule01Component implements OnInit, OnChanges {
    public moment = moment;
    public environment = getEnvironment();
    public swiperInstance: any;
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
    public isOpacity: boolean;
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
        this.screeningEventSeriesDisplayLength = 0;
        this.performanceDisplayLength = 0;
        this.screeningEventSeriesDisplayLength = (this.direction === Models.Common.Direction.HORIZONTAL)
            ? 5 : 12;
        this.performanceDisplayLength = (this.direction === Models.Common.Direction.HORIZONTAL)
            ? 5 : 5;
        this.itemHeight = (this.direction === Models.Common.Direction.HORIZONTAL)
            ? (1080 - 60) / this.screeningEventSeriesDisplayLength
            : (1920 - 60) / this.screeningEventSeriesDisplayLength;
        const swiperConfig = {
            spaceBetween: 0,
            autoplay: (this.page === undefined)
                ? { delay: this.environment.AUTOPLAY_DELAY_TIME }
                : undefined,
            effect: 'fade', // (this.page === undefined) ? 'slide' : 'fade',
        };
        this.swiperInstance = new (<any>window).Swiper('.swiper-container', swiperConfig);
        this.isOpacity = true;
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
        const now = moment().toDate();
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
        }[] = [{
            group: [],
            emptyGroup: []
        }];
        let pageCount = 0;
        let eventCount = 0;
        const limit = this.screeningEventSeriesDisplayLength * this.performanceDisplayLength;
        screeningEventsGroup.forEach(group => {
            group.data.forEach((d, i) => {
                if (pages[pageCount] === undefined) {
                    pages[pageCount] = {
                        group: [],
                        emptyGroup: []
                    };
                }
                const findResult =
                    pages[pageCount].group.find(g => g.screeningEvent.superEvent.id === d.screeningEvent.superEvent.id);
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
                    eventCount += this.performanceDisplayLength - group.data.length % this.performanceDisplayLength;
                }
                if (eventCount === limit) {
                    pageCount++;
                }
            });
        });
        pages.forEach(p => {
            eventCount = 0;
            p.group.forEach(g => {
                if (g.data.length % this.performanceDisplayLength === 0) {
                    return;
                }
                g.empty = [...Array(this.performanceDisplayLength - (g.data.length % this.performanceDisplayLength)).keys()];
            });
            p.group.forEach(g => {
                eventCount += g.data.length + g.empty.length;
            });
            p.emptyGroup = [...Array(this.screeningEventSeriesDisplayLength - eventCount / this.performanceDisplayLength).keys()]
                .map(() => {
                    return { empty: [...Array(this.performanceDisplayLength).keys()] };
                });
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
