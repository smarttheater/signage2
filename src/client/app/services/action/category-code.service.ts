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
export class ActionCategoryCodeService {
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private cinerinoService: CinerinoService,
        private utilService: UtilService
    ) {
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * 区分情報取得
     */
    public async searchCategoryCode(params: {
        categorySetIdentifier: factory.chevre.categoryCode.CategorySetIdentifier;
    }) {
        try {
            this.utilService.loadStart({
                process: 'action.CategoryCode.search',
            });
            const { categorySetIdentifier } = params;
            const limit = 100;
            let page = 1;
            let roop = true;
            let result: factory.chevre.categoryCode.ICategoryCode[] = [];
            await this.cinerinoService.getServices();
            while (roop) {
                const searchResult =
                    await this.cinerinoService.categoryCode.search({
                        limit,
                        page,
                        inCodeSet: {
                            identifier: {
                                $eq: categorySetIdentifier,
                            },
                        },
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
