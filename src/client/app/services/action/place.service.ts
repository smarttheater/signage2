import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Functions } from '../..';
import * as reducers from '../../store/reducers';
import { UtilService } from '../util.service';

@Injectable({
    providedIn: 'root',
})
export class ActionPlaceService {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
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
        const branchCode = params?.branchCode?.$eq;
        try {
            this.utilService.loadStart({
                process: 'action.Place.searchMovieTheaters',
            });
            await Functions.SmartTheaterApi.authorize();
            const response = await Functions.SmartTheaterApi.searchMovieTheaters();
            this.utilService.loadEnd();
            if (branchCode) {
                const newResponse: Functions.SmartTheaterApi.TheaterTypes[] = [];
                response.forEach((movieTheater) => {
                    if (movieTheater.branchCode === branchCode) {
                        newResponse.push(movieTheater);
                    }
                });
                return Functions.SmartTheaterApi.convertMovieTheaters(newResponse);
            }
            return Functions.SmartTheaterApi.convertMovieTheaters(response);
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
        const branchCode = params?.branchCode?.$eq;
        const containedInPlaceBranchCode = params?.containedInPlace?.branchCode?.$eq;
        try {
            this.utilService.loadStart({
                process: 'action.Place.searchScreeningRooms',
            });
            let result: factory.chevre.place.screeningRoom.IPlace[] = [];
            await Functions.SmartTheaterApi.authorize();
            const response = await Functions.SmartTheaterApi.searchScreeningRooms();
            this.utilService.loadEnd();
            result = Functions.SmartTheaterApi.convertScreeningRooms(response, branchCode, containedInPlaceBranchCode);
            return result;
        } catch (error) {
            this.utilService.setError(error);
            this.utilService.loadEnd();
            throw error;
        }
    }
}
