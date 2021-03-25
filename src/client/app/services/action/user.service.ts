import { Injectable } from '@angular/core';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Models } from '../..';
import { userAction } from '../../store/actions';
import * as reducers from '../../store/reducers';
import { UtilService } from '../util.service';

@Injectable({
    providedIn: 'root'
})
export class ActionUserService {
    public user: Observable<reducers.IUserState>;
    public error: Observable<string | null>;
    constructor(
        private store: Store<reducers.IState>,
        private translate: TranslateService,
        private utilService: UtilService
    ) {
        this.user = this.store.pipe(select(reducers.getUser));
        this.error = this.store.pipe(select(reducers.getError));
    }

    /**
     * データ取得
     */
    public async getData() {
        return new Promise<reducers.IUserState>((resolve) => {
            this.user.subscribe((user) => {
                resolve(user);
            }).unsubscribe();
        });
    }

    /**
     * データ削除
     */
    public delete() {
        this.store.dispatch(userAction.remove());
    }

    /**
     * すべて更新
     */
    public updateAll(params: {
        movieTheater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
        screeningRoom?: factory.chevre.place.screeningRoom.IPlace;
        page?: number;
        layout: Models.Common.Layout;
    }) {
        this.store.dispatch(userAction.updateAll(params));
    }

    /**
     * 言語更新
     */
    public updateLanguage(language: string) {
        const element = document.querySelector<HTMLSelectElement>('#language');
        if (element !== null) {
            element.value = language;
        }
        this.translate.use(language);
        const html = <HTMLElement>document.querySelector('html');
        html.setAttribute('lang', language);
        this.store.dispatch(userAction.updateLanguage({ language }));
    }

    /**
     * バージョン確認
     */
    public async checkVersion() {
        const query = `?date=${moment().toISOString()}`;
        const { version } = await this.utilService.getJson<{ version: string }>(`/api/version${query}`);
        const data = await this.getData();
        if (data.version === undefined) {
            this.store.dispatch(userAction.setVersion({ version }));
        }
        if (data.version !== undefined
            && data.version !== version) {
            this.store.dispatch(userAction.setVersion({ version }));
            location.reload();
        }
    }

}
