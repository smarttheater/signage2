import { Injectable } from '@angular/core';
import { ActionEventService } from './action/event.service';
import { ActionUserService } from './action/user.service';

@Injectable({
    providedIn: 'root',
})
export class ActionService {
    constructor(
        public user: ActionUserService,
        public event: ActionEventService
    ) {}
}
