import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BaseComponent } from './components/pages/base/base.component';
import { AlertModalComponent } from './components/parts/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './components/parts/confirm-modal/confirm-modal.component';
import { ContentsComponent } from './components/parts/contents/contents.component';
import { CurrentDateTimeComponent } from './components/parts/current-date-time/current-date-time.component';
import { LoadingComponent } from './components/parts/loading/loading.component';
import { ChangeLanguagePipe } from './pipes/change-language.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { LibphonenumberFormatPipe } from './pipes/libphonenumber-format.pipe';

const components = [
    LoadingComponent,
    ContentsComponent,
    BaseComponent,
    CurrentDateTimeComponent,
];

const entryComponents = [AlertModalComponent, ConfirmModalComponent];

@NgModule({
    declarations: [
        ...components,
        ...entryComponents,
        LibphonenumberFormatPipe,
        ChangeLanguagePipe,
        FormatDatePipe,
    ],
    entryComponents,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        ModalModule,
        BsDatepickerModule,
        PaginationModule,
        NgxIntlTelInputModule,
    ],
    exports: [
        ...components,
        ...entryComponents,
        LibphonenumberFormatPipe,
        ChangeLanguagePipe,
        FormatDatePipe,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        ModalModule,
        BsDatepickerModule,
        PaginationModule,
        NgxIntlTelInputModule,
    ],
    providers: [],
})
export class SharedModule {}
