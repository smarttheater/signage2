import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions, Models } from '../..';
import * as reducers from '../../store/reducers';
import { CinerinoService } from '../cinerino.service';
import { UtilService } from '../util.service';

@Injectable({
    providedIn: 'root',
})
export class ActionEventService {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private cinerinoService: CinerinoService,
        private utilService: UtilService
    ) {
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 空席情報取得
     */
    public async searchSeats(params: {
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
    }) {
        try {
            this.utilService.loadStart({
                process: 'action.Event.searchSeats',
            });
            const { screeningEvent } = params;
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.place.seat.IPlaceWithOffer[] = [];
            if (
                !new Models.Purchase.Performance({
                    screeningEvent,
                }).isTicketedSeat()
            ) {
                this.utilService.loadEnd();
                return result;
            }
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult =
                    await this.cinerinoService.event.searchSeats({
                        event: { id: screeningEvent.id },
                        page,
                        limit,
                    });
                result = [...result, ...searchResult.data];
                page++;
                roop = searchResult.data.length === limit;
                if (roop) {
                    await Functions.Util.sleep();
                }
            }
            this.utilService.loadEnd();
            return result;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * 施設コンテンツ検索
     */
    public async searchScreeningEventSeries(params: {
        location?: {
            branchCode?: {
                $eq?: string;
            };
            branchCodes?: string[];
        };
        workPerformed?: {
            identifiers?: string[];
        };
    }) {
        try {
            this.utilService.loadStart({
                process: 'action.Event.search',
            });
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.event.screeningEventSeries.IEvent[] = [];
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult = await this.cinerinoService.event.search({
                    ...params,
                    page,
                    limit,
                    typeOf: factory.chevre.eventType.ScreeningEventSeries,
                });
                result = [...result, ...searchResult.data];
                page++;
                roop = searchResult.data.length === limit;
                if (roop) {
                    await Functions.Util.sleep();
                }
            }
            this.utilService.loadEnd();
            return result;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * スケジュール一覧取得
     */
    public async searchScreeningEvent(params: {
        superEvent: {
            ids?: string[];
            locationBranchCodes?: string[];
            workPerformedIdentifiers?: string[];
        };
        location?: {
            branchCode?: {
                $eq?: string;
            };
            branchCodes?: string[];
        };
        startFrom: Date;
        startThrough: Date;
        pageing?: boolean;
        screeningEventSeries?: factory.chevre.event.screeningEventSeries.IEvent[];
        screeningRooms?: factory.chevre.place.screeningRoom.IPlace[];
        creativeWorks?: factory.chevre.creativeWork.movie.ICreativeWork[];
    }) {
        try {
            const {
                superEvent,
                startFrom,
                startThrough,
                location,
                screeningEventSeries,
                screeningRooms,
                creativeWorks,
            } = params;
            const pageing =
                params.pageing === undefined ? true : params.pageing;
            this.utilService.loadStart({
                process: 'action.Event.search',
            });
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.event.screeningEvent.IEvent[] = [];
            await this.cinerinoService.getServices();
            const now = moment(
                (await this.utilService.getServerTime()).date
            ).toDate();
            const today = moment(
                moment(now).format('YYYYMMDD'),
                'YYYYMMDD'
            ).toDate();
            while (roop) {
                const searchResult = await this.cinerinoService.event.search({
                    page,
                    limit,
                    typeOf: factory.chevre.eventType.ScreeningEvent,
                    eventStatuses: [
                        factory.chevre.eventStatusType.EventScheduled,
                    ],
                    superEvent,
                    startFrom,
                    startThrough,
                    location,
                    offers: {
                        availableFrom: today,
                        availableThrough: moment(today)
                            .add(1, 'day')
                            .add(-1, 'millisecond')
                            .toDate(),
                    },
                });
                result = [...result, ...searchResult.data];
                page++;
                roop = searchResult.data.length === limit && pageing;
                if (roop) {
                    await Functions.Util.sleep();
                }
            }
            result = result.filter((r) => {
                return (
                    r.offers !== undefined &&
                    moment(r.offers.availabilityStarts).toDate() < now
                );
            });
            if (screeningEventSeries !== undefined) {
                result = result.sort((a, b) => {
                    const KEY_NAME = 'sortNumber';
                    const sortNumberA =
                        screeningEventSeries
                            .find((s) => s.id === a.superEvent.id)
                            ?.additionalProperty?.find(
                                (p) => p.name === KEY_NAME
                            )?.value || '0';
                    const sortNumberB =
                        screeningEventSeries
                            .find((s) => s.id === b.superEvent.id)
                            ?.additionalProperty?.find(
                                (p) => p.name === KEY_NAME
                            )?.value || '0';
                    return Number(sortNumberB) - Number(sortNumberA);
                });
            } else if (screeningRooms !== undefined) {
                result = result.sort((a, b) => {
                    const KEY_NAME = 'sortNumber';
                    const sortNumberA =
                        screeningRooms
                            .find((s) => s.id === a.superEvent.id)
                            ?.additionalProperty?.find(
                                (p) => p.name === KEY_NAME
                            )?.value || '0';
                    const sortNumberB =
                        screeningRooms
                            .find((s) => s.id === b.superEvent.id)
                            ?.additionalProperty?.find(
                                (p) => p.name === KEY_NAME
                            )?.value || '0';
                    return Number(sortNumberB) - Number(sortNumberA);
                });
            }
            if (creativeWorks !== undefined) {
                result.forEach((r) => {
                    const findResult = creativeWorks.find(
                        (c) => c.identifier === r.workPerformed?.identifier
                    );
                    if (
                        r.workPerformed === undefined ||
                        findResult === undefined
                    ) {
                        return;
                    }
                    r.workPerformed.contentRating = findResult.contentRating;
                });
            }
            this.utilService.loadEnd();
            return result;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }
}
