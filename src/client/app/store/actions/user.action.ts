import { factory } from '@cinerino/sdk';
import { createAction, props } from '@ngrx/store';
import { Models } from '../..';

const LABEL = '[User]';

export const remove = createAction(`${LABEL} remove`);

export const updateAll = createAction(
    `${LABEL} updateAll`,
    props<{
        movieTheater: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom;
        screeningRoom?: factory.chevre.place.screeningRoom.IPlace;
        page?: number;
        direction: Models.Common.Direction;
        image?: string;
        color: Models.Common.Color;
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
