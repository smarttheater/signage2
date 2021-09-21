import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
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
    public async getScreeningEventSeats(params: {
        screeningEvent: factory.chevre.event.screeningEvent.IEvent;
    }) {
        try {
            this.utilService.loadStart({
                process: 'eventAction.GetScreeningEventSeats',
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
}
