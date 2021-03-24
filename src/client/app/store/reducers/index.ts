import {
    createFeatureSelector,
    createSelector
} from '@ngrx/store';
import * as reducer from './reducer';

/**
 * State and reducer
 */
export {
    IState,
    reducer
} from './reducer';

export * from './user.reducer';
export * from './master.reducer';

/**
 * Selectors
 */
export const getFeatureState = createFeatureSelector<reducer.IState>('App');
export const getLoading = createSelector(getFeatureState, reducer.getLoading);
export const getProcess = createSelector(getFeatureState, reducer.getProcess);
export const getError = createSelector(getFeatureState, reducer.getError);
export const getUser = createSelector(getFeatureState, reducer.getUser);
export const getMaster = createSelector(getFeatureState, reducer.getMaster);
