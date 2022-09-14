import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Functions } from '../..';
import * as reducers from '../../store/reducers';
import { UtilService } from '../util.service';

@Injectable({
    providedIn: 'root',
})
export class ActionCreativeWorkService {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private utilService: UtilService
    ) {
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 作品一覧検索
     */
    public async searchMovies(params: {
        identifier?:
            | string
            | {
                  $eq?: string;
              };
        name?: string;
        datePublishedFrom?: Date;
        datePublishedThrough?: Date;
        offers?: {
            availableFrom?: Date;
            availableThrough?: Date;
        };
    }) {
        try {
            this.utilService.loadStart({
                process: 'action.CreativeWork.searchMovies',
            });
            await Functions.SmartTheaterApi.authorize();
            const response = await Functions.SmartTheaterApi.searchMovies({
                datePublishedFrom: params.datePublishedFrom?.toISOString(),
                datePublishedThrough: params.datePublishedThrough?.toISOString(),
                offersAvailableFrom: params.offers?.availableFrom?.toISOString(),
            });
            const sortResponse = response.sort((a, b) => {
                if (a.datePublished < b.datePublished) {
                    return 1;
                } else if (a.datePublished > b.datePublished) {
                    return -1;
                } else {
                    return 0;
                }
            });
            this.utilService.loadEnd();
            return Functions.SmartTheaterApi.convertSearchMovies(sortResponse);
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }
}
