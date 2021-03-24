import { factory } from '@cinerino/sdk';
import { Action, createReducer, on } from '@ngrx/store';
import { IState } from '.';
import { userAction } from '../actions';

export interface IUserState {
    /**
     * 劇場
     */
    theater?: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
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
    language: 'ja'
};

export function reducer(initialState: IState, action: Action) {
    return createReducer(
        initialState,
        on(userAction.remove, state => {
            return {
                ...state,
                userData: {
                    language: 'ja'
                }, loading: false, process: ''
            };
        }),
        on(userAction.updateAll, (state, payload) => {
            const theater = payload.theater;

            return {
                ...state, userData: {
                    ...state.userData,
                    theater,
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
