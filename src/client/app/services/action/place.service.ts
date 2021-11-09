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
export class ActionPlaceService {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private cinerinoService: CinerinoService,
        private utilService: UtilService
    ) {
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 劇場一覧取得
     */
    public async searchMovieTheaters(
        params?: factory.chevre.place.movieTheater.ISearchConditions
    ) {
        try {
            this.utilService.loadStart({
                process: 'action.Place.searchMovieTheaters',
            });
            await this.cinerinoService.getServices();
            const searchResult =
                await this.cinerinoService.place.searchMovieTheaters(
                    params === undefined ? {} : params
                );
            this.utilService.loadEnd();
            return searchResult.data;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }

    /**
     * スクリーン検索
     */
    public async searchScreeningRooms(params?: {
        branchCode?: {
            $eq?: string;
        };
        containedInPlace?: {
            branchCode?: {
                $eq?: string;
            };
        };
    }) {
        try {
            this.utilService.loadStart({
                process: 'action.Place.searchScreeningRooms',
            });
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.place.screeningRoom.IPlace[] = [];
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult =
                    await this.cinerinoService.place.searchScreeningRooms({
                        ...params,
                        page,
                        limit,
                    });
                result = [...result, ...searchResult.data];
                page++;
                roop = searchResult.data.length === limit;
                await Functions.Util.sleep();
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
