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
    * 向き
    */
    direction: Models.Common.Direction;
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
    /**
     * 画像
     */
    image?: string;
}

export const userInitialState: IUserState = {
    language: 'ja',
    direction: Models.Common.Direction.HORIZONTAL,
    layout: Models.Common.Layout.TYPE01,
};

export function reducer(initialState: IState, action: Action) {
    return createReducer(
        initialState,
        on(userAction.remove, state => {
            return {
                ...state,
                userData: {
                    language: 'ja',
                    direction: Models.Common.Direction.HORIZONTAL,
                    layout: Models.Common.Layout.TYPE01,
                }, loading: false, process: ''
            };
        }),
        on(userAction.updateAll, (state, payload) => {
            const {
                movieTheater,
                screeningRoom,
                page,
                layout,
                direction,
                image
            } = payload;

            return {
                ...state, userData: {
                    ...state.userData,
                    movieTheater,
                    screeningRoom,
                    page,
                    direction,
                    layout,
                    image,
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
