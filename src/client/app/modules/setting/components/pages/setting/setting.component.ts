import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, NgxIntlTelInputComponent, SearchCountryField, TooltipLabel, } from 'ngx-intl-tel-input';
import { Observable } from 'rxjs';
import { getEnvironment } from '../../../../../../environments/environment';
import { ActionService, MasterService, UtilService } from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
    public settingForm: FormGroup;
    public user: Observable<reducers.IUserState>;
    public master: Observable<reducers.IMasterState>;
    public error: Observable<string | null>;
    public isLoading: Observable<boolean>;
    public theaters: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom[];
    public environment = getEnvironment();
    public SearchCountryField = SearchCountryField;
    public TooltipLabel = TooltipLabel;
    public CountryISO = CountryISO;
    @ViewChild('intlTelInput') private intlTelInput: NgxIntlTelInputComponent;

    constructor(
        private formBuilder: FormBuilder,
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private actionService: ActionService,
        private masterService: MasterService,
        private translate: TranslateService,
        private router: Router
    ) { }

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.error = this.store.pipe(select(reducers.getError));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.theaters = [];
        try {
            this.theaters = await this.masterService.searchMovieTheaters();
            await this.createSettlingForm();
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
        setTimeout(() => {
            if (this.intlTelInput === undefined) {
                return;
            }
            const findResult = this.intlTelInput.allCountries.find(c => c.iso2 === CountryISO.Japan);
            if (findResult === undefined) {
                return;
            }
            findResult.placeHolder = this.translate.instant('form.placeholder.telephone');
        }, 0);
    }

    /**
     * フォーム作成
     */
    private async createSettlingForm() {
        this.settingForm = this.formBuilder.group({
            theaterId: ['', [Validators.required]],
        });
        const user = await this.actionService.user.getData();
        if (user.theater !== undefined) {
            this.settingForm.controls.theaterId.setValue(user.theater.id);
        }
    }

    /**
     * 設定変更
     */
    public async onSubmit() {
        Object.keys(this.settingForm.controls).forEach((key) => {
            this.settingForm.controls[key].markAsTouched();
        });
        if (this.settingForm.invalid) {
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('setting.alert.validation')
            });
            return;
        }
        try {
            const theaterId = this.settingForm.controls.theaterId.value;
            const theater = this.theaters.find(t => (t.id === theaterId));
            if (theater === undefined) {
                throw new Error('theater not found');
            }
            this.actionService.user.updateAll({
                theater,
            });
            this.utilService.openAlert({
                title: this.translate.instant('common.complete'),
                body: this.translate.instant('setting.alert.success')
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 必須判定
     */
     public isRequired(key: String) {
        if (key === 'theaterBranchCode') {
            return true;
        }
        return false;
    }

    /**
     * 購入者情報フォームのコントロールkeyを配列で返却
     */
     public getProfileFormKeys() {
        return Object.keys(this.settingForm.controls);
    }

}
