import { Injectable } from '@angular/core';
import { ActionUserService } from './action/user.service';

@Injectable({
    providedIn: 'root'
})
export class ActionService {
    constructor(
        public user: ActionUserService
    ) { }
}
