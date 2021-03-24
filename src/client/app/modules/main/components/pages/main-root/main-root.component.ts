import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-main-root',
    templateUrl: './main-root.component.html',
    styleUrls: ['./main-root.component.scss']
})
export class MainRootComponent implements OnInit {
    public environment = getEnvironment();

    constructor(
        private router: Router
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        if (this.environment.VIEW_TYPE === Models.Common.ViewType.Cinema) {
            this.router.navigate(['/cinema/dashboard']);
            return;
        }
        this.router.navigate(['/event/dashboard']);
    }

}
