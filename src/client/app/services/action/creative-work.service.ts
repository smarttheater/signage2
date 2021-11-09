import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Functions } from '../..';
import * as reducers from '../../store/reducers';
import { CinerinoService } from '../cinerino.service';
import { UtilService } from '../util.service';

@Injectable({
    providedIn: 'root',
})
export class ActionCreativeWorkService {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private cinerinoService: CinerinoService,
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
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.creativeWork.movie.ICreativeWork[] = [];
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult =
                    await this.cinerinoService.creativeWork.searchMovies({
                        page,
                        limit,
                        ...params,
                    });
                result = [...result, ...searchResult.data];
                page++;
                roop = searchResult.data.length === limit;
                if (roop) {
                    await Functions.Util.sleep();
                }
            }
            const sortResult = result.sort((a, b) => {
                const KEY_NAME = 'sortNumber';
                const sortNumberA =
                    result
                        .find((s) => s.id === a.id)
                        ?.additionalProperty?.find((p) => p.name === KEY_NAME)
                        ?.value || '0';
                const sortNumberB =
                    result
                        .find((s) => s.id === b.id)
                        ?.additionalProperty?.find((p) => p.name === KEY_NAME)
                        ?.value || '0';
                return Number(sortNumberB) - Number(sortNumberA);
            });
            this.utilService.loadEnd();
            return sortResult;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }
}
