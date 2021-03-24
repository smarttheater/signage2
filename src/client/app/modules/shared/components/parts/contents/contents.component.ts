import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ActionService } from '../../../../../services';

@Component({
    selector: 'app-contents',
    templateUrl: './contents.component.html',
    styleUrls: ['./contents.component.scss']
})
export class ContentsComponent implements OnInit {
    @Input() public touch?: boolean;

    constructor(
        private router: Router,
        private elementRef: ElementRef,
        private actionService: ActionService
    ) { }

    public async ngOnInit() {
        await this.actionService.user.checkVersion();
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const element: HTMLElement = this.elementRef.nativeElement.querySelector('.scroll');
                setTimeout(() => {
                    element.scrollTop = 0;
                }, 0);
            }
        });
        if (this.touch === undefined) {
            this.touch = true;
        }
    }

    public isSupportBrowser() {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return (userAgent.indexOf('edge') !== -1
            || userAgent.indexOf('chrome') !== -1
            || userAgent.indexOf('safari') !== -1);
    }

}
