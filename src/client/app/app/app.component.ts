/**
 * AppComponent
 */
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Functions, Models } from '..';
import { getEnvironment } from '../../environments/environment';
import { ActionService } from '../services';

declare const ga: Function;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    public isRouter: boolean;
    public environment = getEnvironment();

    constructor(
        private router: Router,
        private translate: TranslateService,
        private actionService: ActionService
    ) {}

    /**
     * 初期化
     * @method ngOnInit
     */
    public async ngOnInit() {
        this.isRouter = false;
        this.locales();
        if (this.environment.ANALYTICS_ID !== '') {
            this.analytics();
        }
        try {
            await this.external();
        } catch (error) {
            console.error(error);
        }
        this.isRouter = true;
    }

    /**
     * 外部情報
     */
    public async external() {
        if (location.hash !== '') {
            return;
        }
        const {
            theaterBranchCode,
            roomBranchCode,
            page,
            direction,
            period,
            dateFormat,
            image,
            color,
            language,
            // redirectUrl,
        } = Functions.Util.getExternalData();
        if (language !== undefined) {
            this.actionService.user.updateLanguage(language);
        }
        if (theaterBranchCode !== undefined) {
            const movieTheaters =
                await this.actionService.place.searchMovieTheaters({
                    branchCode: {
                        $eq: theaterBranchCode,
                    },
                });
            if (movieTheaters.length === 0) {
                throw new Error('movieTheaters.length === 0');
            }
            const movieTheater = movieTheaters[0];
            let screeningRoom;
            if (roomBranchCode !== undefined) {
                const screeningRooms =
                    await this.actionService.place.searchScreeningRooms({
                        containedInPlace: {
                            branchCode: {
                                $eq: theaterBranchCode,
                            },
                        },
                        branchCode: {
                            $eq: roomBranchCode,
                        },
                    });
                screeningRoom = screeningRooms[0];
            }
            this.actionService.user.updateAll({
                movieTheater,
                screeningRoom,
                page: Number(page) < 10 ? Number(page) : undefined,
                direction:
                    direction === Models.Common.Direction.HORIZONTAL ||
                    direction === Models.Common.Direction.VERTICAL
                        ? direction
                        : Models.Common.Direction.HORIZONTAL,
                period:
                    Number(period) === 86400 ||
                    Number(period) === 259200 ||
                    Number(period) === 604800
                        ? Number(period)
                        : 86400,
                dateFormat:
                    dateFormat === 'HH:mm' ||
                    dateFormat === 'MM/DD HH:mm' ||
                    dateFormat === 'YYYY/MM/DD HH:mm'
                        ? dateFormat
                        : 'HH:mm',
                image: image === undefined ? undefined : image,
                color:
                    color === Models.Common.Color.Darkgray ||
                    color === Models.Common.Color.Darkred ||
                    color === Models.Common.Color.Darkblue ||
                    color === Models.Common.Color.Darkgreen
                        ? color
                        : Models.Common.Color.Darkgray,
            });
            console.log('SAVE!!!!!!!!!!!!');
        }
    }

    /**
     * 言語設定
     * @example {{ 'HOME.HELLO' | translate: { value: 'world'} }}
     */
    private locales() {
        this.translate.addLangs(this.environment.LANGUAGE);
        this.translate.setDefaultLang('ja');
    }

    /**
     * Googleアナリティクス pageview イベント
     */
    private analytics() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // Googleアナリティクス pageview
                try {
                    ga('create', this.environment.ANALYTICS_ID, 'auto');
                    ga('set', 'page', event.urlAfterRedirects);
                    ga('send', 'pageview');
                } catch (error) {
                    console.warn(error);
                }
            }
        });
    }
}
