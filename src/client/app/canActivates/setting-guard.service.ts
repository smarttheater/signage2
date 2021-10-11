/**
 * SettingGuardService
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActionService } from '../services';

@Injectable({
    providedIn: 'root',
})
export class SettingGuardService implements CanActivate {
    constructor(private router: Router, private actionService: ActionService) {}

    /**
     * 認証
     * @method canActivate
     * @returns {Promise<boolean>}
     */
    public async canActivate(): Promise<boolean> {
        try {
            const { settings } = await this.actionService.user.getData();
            if (settings === undefined) {
                throw new Error('settings undefined');
            }
            const { movieTheater } = settings;
            if (movieTheater === undefined) {
                throw new Error('movieTheater undefined');
            }

            return true;
        } catch (error) {
            this.router.navigate(['/setting']);

            return false;
        }
    }
}
