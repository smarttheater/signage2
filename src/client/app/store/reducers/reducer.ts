import { Action } from '@ngrx/store';
import { getEnvironment } from '../../../environments/environment';
import * as userReducer from './user.reducer';
import * as utilReducer from './util.reducer';

/**
 * State
 */
export interface IState {
    loading: boolean;
    process: string;
    error: string | null;
    userData: userReducer.IUserState;
}

/**
 * Initial state
 */
export const initialState: IState = {
    loading: false,
    process: '',
    error: null,
    userData: userReducer.userInitialState,
};

function getInitialState(): IState {
    const environment = getEnvironment();
    const saveJson = (<Storage>(<any>window)[environment.STORAGE_TYPE]).getItem(
        environment.STORAGE_NAME
    );
    if (saveJson === undefined || saveJson === null) {
        return initialState;
    }
    const saveData: { App: IState } = JSON.parse(saveJson);
    const sessonJson = sessionStorage.getItem('SESSION_STATE');
    const sessionData =
        sessonJson === undefined || sessonJson === null
            ? { App: {} }
            : JSON.parse(sessonJson);
    const data: IState = {
        ...initialState,
        ...saveData.App,
        ...sessionData.App,
    };

    if (data.userData.settings === undefined) {
        const { movieTheater, screeningRoom, page, direction, image, color } = <
            any
        >data.userData;
        data.userData.settings = {
            movieTheater,
            screeningRoom,
            page,
            direction,
            period: 86400,
            dateFormat: 'HH:mm',
            image,
            color,
        };
    }
    (<any>data).userData.movieTheater = undefined;
    (<any>data).userData.screeningRoom = undefined;
    (<any>data).userData.page = undefined;
    (<any>data).userData.direction = undefined;
    (<any>data).userData.image = undefined;
    (<any>data).userData.color = undefined;

    data.loading = false;
    return data;
}

/**
 * Reducer
 * @param state
 * @param action
 */
export function reducer(state = getInitialState(), action: Action): IState {
    if (/\[User\]/.test(action.type)) {
        return userReducer.reducer(state, action);
    } else if (/\[Util\]/.test(action.type)) {
        return utilReducer.reducer(state, action);
    } else {
        return state;
    }
}

/**
 * Selectors
 */
export const getLoading = (state: IState) => state.loading;
export const getProcess = (state: IState) => `process.${state.process}`;
export const getError = (state: IState) => state.error;
export const getUser = (state: IState) => state.userData;
