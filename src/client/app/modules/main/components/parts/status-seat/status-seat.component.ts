import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
} from '@angular/core';
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
    selector: 'app-status-seat',
    templateUrl: './status-seat.component.html',
    styleUrls: ['./status-seat.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class StatusSeatComponent implements OnInit, OnChanges {
    public moment = moment;
    public environment = getEnvironment();
    public screeningEventDisplayLength: number;
    public itemHeight: number;
    public swiperConfig: SwiperOptions;
    @Input()
    public inputData: {
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
        screeningEventSeats: factory.chevre.place.seat.IPlaceWithOffer[];
    }[];
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
            allowSlidePrev: false,
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
        this.screeningEventDisplayLength = 0;
        this.screeningEventDisplayLength =
            this.direction === Models.Common.Direction.HORIZONTAL ? 5 : 12;
        this.itemHeight =
            this.direction === Models.Common.Direction.HORIZONTAL
                ? (1080 - 60) / this.screeningEventDisplayLength
                : (1920 - 60) / this.screeningEventDisplayLength;
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
