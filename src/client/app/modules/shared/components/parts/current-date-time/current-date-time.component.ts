import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-current-date-time',
    templateUrl: './current-date-time.component.html',
    styleUrls: ['./current-date-time.component.scss']
})
export class CurrentDateTimeComponent implements OnInit, OnDestroy {
    public timer: any;
    public date: string;
    constructor(
    ) { }

    public ngOnInit() {
        this.update();
    }

    public ngOnDestroy() {
        clearTimeout(this.timer);
    }

    private update() {
        this.date = moment().format('YYYY/MM/DD (ddd) HH:mm');
        const time = 1000;
        this.timer = setTimeout(() => { this.update(); }, time);
    }

}
