import { factory } from '@cinerino/sdk';
import { Action, createReducer, on } from '@ngrx/store';
import { IState } from '.';
import { Models } from '../..';
import { userAction } from '../actions';

export interface IUserState {
    settings: {
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
         * 期間(秒)
         */
        period: number;
        /**
         * 日時フォーマット
         */
        dateFormat: 'YYYY/MM/DD HH:mm' | 'MM/DD HH:mm' | 'HH:mm';
        /**
         * 画像
         */
        image?: string;
        /**
         * 色
         */
        color: Models.Common.Color;
    };
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
    settings: {
        direction: Models.Common.Direction.HORIZONTAL,
        color: Models.Common.Color.Darkgray,
        period: 86400,
        dateFormat: 'HH:mm',
    },
};

export function reducer(initialState: IState, action: Action) {
    return createReducer(
        initialState,
        on(userAction.remove, (state) => {
            return {
                ...state,
                userData: {
                    language: 'ja',
                    settings: {
                        direction: Models.Common.Direction.HORIZONTAL,
                        color: Models.Common.Color.Darkgray,
                        period: 86400,
                        dateFormat: 'HH:mm',
                    },
                },
                loading: false,
                process: '',
            };
        }),
        on(userAction.updateAll, (state, payload) => {
            const {
                movieTheater,
                screeningRoom,
                page,
                direction,
                period,
                dateFormat,
                image,
                color,
            } = payload;

            return {
                ...state,
                userData: {
                    ...state.userData,
                    settings: {
                        movieTheater,
                        screeningRoom,
                        page,
                        direction,
                        period,
                        dateFormat,
                        image,
                        color,
                    },
                },
                loading: false,
                process: '',
            };
        }),
        on(userAction.updateLanguage, (state, payload) => {
            const language = payload.language;
            return { ...state, userData: { ...state.userData, language } };
        }),
        on(userAction.setVersion, (state, payload) => {
            const version = payload.version;
            return { ...state, userData: { ...state.userData, version } };
        })
    )(initialState, action);
}
