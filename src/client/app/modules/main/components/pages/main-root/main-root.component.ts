import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
        this.router.navigate(['/dashboard']);
    }

}
