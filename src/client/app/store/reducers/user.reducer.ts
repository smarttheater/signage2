import { factory } from '@cinerino/sdk';
import { Action, createReducer, on } from '@ngrx/store';
import { IState } from '.';
import { Models } from '../..';
import { userAction } from '../actions';

export interface IUserState {
    /**
     * 劇場
     */
    movieTheater?: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
    /**
     * スクリーン
     */
    screeningRoom?: factory.chevre.place.screeningRoom.IPlace;
    /**
     * ページ
     */
    page?: number;
    /**
    * レイアウト
    */
    layout: Models.Common.Layout;
    /**
     * 言語
     */
    language: string;
    /**
     * バージョン
     */
    version?: string;
}

export const userInitialState: IUserState = {
    language: 'ja',
    layout: Models.Common.Layout.HORIZONTAL
};

export function reducer(initialState: IState, action: Action) {
    return createReducer(
        initialState,
        on(userAction.remove, state => {
            return {
                ...state,
                userData: {
                    language: 'ja',
                    layout: Models.Common.Layout.HORIZONTAL
                }, loading: false, process: ''
            };
        }),
        on(userAction.updateAll, (state, payload) => {
            const { movieTheater, screeningRoom, page, layout } = payload;

            return {
                ...state, userData: {
                    ...state.userData,
                    movieTheater,
                    screeningRoom,
                    page,
                    layout,
                }, loading: false, process: ''
            };
        }),
        on(userAction.updateLanguage, (state, payload) => {
            const language = payload.language;
            return { ...state, userData: { ...state.userData, language } };
        }),
        on(userAction.setVersion, (state, payload) => {
            const version = payload.version;
            return { ...state, userData: { ...state.userData, version } };
        }),
    )(initialState, action);
}
