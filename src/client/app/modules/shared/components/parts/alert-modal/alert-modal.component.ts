import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Models } from '../../../../..';

@Component({
    selector: 'app-alert-modal',
    templateUrl: './alert-modal.component.html',
    styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {
    @Input() public title: string;
    @Input() public body: string;
    @Input() public color: Models.Common.Color;

    constructor(
        public modal: BsModalRef
    ) { }

    public ngOnInit() {
    }

}
