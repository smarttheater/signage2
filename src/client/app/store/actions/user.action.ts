import { factory } from '@cinerino/sdk';
import { createAction, props } from '@ngrx/store';

const LABEL = '[User]';

export const remove = createAction(
    `${LABEL} remove`,
);

export const updateAll = createAction(
    `${LABEL} updateAll`,
    props<{
        theater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
    }>()
);

export const updateLanguage = createAction(
    `${LABEL} updateLanguage`,
    props<{ language: string }>()
);

export const setVersion = createAction(
    `${LABEL} setVersion`,
    props<{ version: string }>()
);
