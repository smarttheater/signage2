import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Functions, Models } from '../..';
import * as reducers from '../../store/reducers';
import { UtilService } from '../util.service';

@Injectable({
    providedIn: 'root',
})
export class ActionEventService {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService
    ) {
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 空席情報取得
     */
    public async searchSeats(params: {
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
        eventId: string;
    }) {
        try {
            this.utilService.loadStart({
                process: 'action.Event.searchSeats',
            });
            const { screeningEvent } = params;
            let result: factory.chevre.place.seat.IPlaceWithOffer[] = [];
            if (
                !new Models.Purchase.Performance({
                    screeningEvent,
                }).isTicketedSeat()
            ) {
                this.utilService.loadEnd();
                return result;
            }
            await Functions.SmartTheaterApi.authorize();
            const response = await Functions.SmartTheaterApi.searchScreeningEventSeats({eventId: params.eventId});
            result = Functions.SmartTheaterApi.convertScreeningEventSeats(response);
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
        const locationBranchCode = params.location?.branchCode?.$eq;
        const workPerformedIdentifiers = params.workPerformed?.identifiers;
        try {
            this.utilService.loadStart({
                process: 'action.Event.search',
            });
            let result: factory.chevre.event.screeningEventSeries.IEvent[] = [];
            let screeningEventSeries: Functions.SmartTheaterApi.ScreeningEventSeriesTypes[] = [];
            await Functions.SmartTheaterApi.authorize();
            if (workPerformedIdentifiers) {
                for (let i = 0; i < workPerformedIdentifiers.length; i += 1) {
                    const response = await Functions.SmartTheaterApi.searchScreeningEventSeries({
                        locationBranchCode,
                        workPerformedIdentifier: workPerformedIdentifiers[i],
                    });
                    screeningEventSeries = [...screeningEventSeries, ...response];
                }
            } else {
                screeningEventSeries = await Functions.SmartTheaterApi.searchScreeningEventSeries({
                    locationBranchCode,
                });
            }
            this.utilService.loadEnd();
            result = Functions.SmartTheaterApi.convertScreeningEventSeries(screeningEventSeries);
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
        superEventLocationBranchCode: string;
    }) {
        try {
            const {
                startFrom,
                startThrough,
                location,
                screeningEventSeries,
                creativeWorks,
                superEventLocationBranchCode,
            } = params;
            this.utilService.loadStart({
                process: 'action.Event.search',
            });
            let result: Functions.SmartTheaterApi.ScreeningEventTypes[] = [];
            await Functions.SmartTheaterApi.authorize();
            const now = moment(
                (await this.utilService.getServerTime()).date
            ).toDate();
            const response = await Functions.SmartTheaterApi.searchScreeningEvent({
                startFrom: startFrom.toISOString(),
                startThrough: startThrough.toISOString(),
                superEventLocationBranchCode,
            });
            if (location?.branchCode?.$eq) {
                response.forEach((screeningEvent) => {
                    if (screeningEvent.location.branchCode === location?.branchCode?.$eq) {
                        result.push(screeningEvent);
                    }
                });
            } else {
                result = response;
            }
            result = result.filter((r) => {
                return (
                    r.offers !== undefined &&
                    moment(r.offers.validFrom).toDate() < now
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
                    r.workPerformed.contentRating = String(findResult.contentRating);
                });
            }
            this.utilService.loadEnd();
            return Functions.SmartTheaterApi.convertSearchScreeningEvent(result);
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }
}
