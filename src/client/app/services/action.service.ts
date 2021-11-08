import { Injectable } from '@angular/core';
import { ActionCategoryCodeService } from './action/category-code.service';
import { ActionCreativeWorkService } from './action/creative-work.service';
import { ActionEventService } from './action/event.service';
import { ActionPlaceService } from './action/place.service';
import { ActionUserService } from './action/user.service';

@Injectable({
    providedIn: 'root',
})
export class ActionService {
    constructor(
        public user: ActionUserService,
        public categoryCode: ActionCategoryCodeService,
        public creativeWork: ActionCreativeWorkService,
        public event: ActionEventService,
        public place: ActionPlaceService
    ) {}
}
