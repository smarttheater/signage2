import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../../../..';
import { getEnvironment } from '../../../../../../environments/environment';
import {
    ActionService,
    MasterService,
    UtilService,
} from '../../../../../services';
import * as reducers from '../../../../../store/reducers';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
    public settingForm: FormGroup;
    public user: Observable<reducers.IUserState>;
    public master: Observable<reducers.IMasterState>;
    public error: Observable<string | null>;
    public isLoading: Observable<boolean>;
    public movieTheaters: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom[];
    public screeningRooms: factory.chevre.place.screeningRoom.IPlace[];
    public pages: string[];
    public environment = getEnvironment();
    public direction = Models.Common.Direction;
    public colors: Models.Common.Color[];

    constructor(
        private formBuilder: FormBuilder,
        private store: Store<reducers.IState>,
        private utilService: UtilService,
        private actionService: ActionService,
        private masterService: MasterService,
        private translate: TranslateService,
        private router: Router
    ) {}

    /**
     * 初期化
     */
    public async ngOnInit() {
        this.user = this.store.pipe(select(reducers.getUser));
        this.error = this.store.pipe(select(reducers.getError));
        this.isLoading = this.store.pipe(select(reducers.getLoading));
        this.movieTheaters = [];
        this.screeningRooms = [];
        this.pages = [...Array(10).keys()].map((i) => String(++i));
        this.colors = Object.values(Models.Common.Color);
        try {
            this.movieTheaters = await this.masterService.searchMovieTheaters();
            await this.createSettlingForm();
            console.log(this.settingForm);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/error']);
        }
    }

    /**
     * フォーム作成
     */
    private async createSettlingForm() {
        this.settingForm = this.formBuilder.group({
            theaterId: ['', [Validators.required]],
            screenId: ['', []],
            page: ['', []],
            direction: ['', [Validators.required]],
            period: ['', [Validators.required]],
            dateFormat: ['', [Validators.required]],
            image: ['', []],
            color: ['', []],
        });
        const { settings } = await this.actionService.user.getData();
        if (settings.movieTheater !== undefined) {
            this.settingForm.controls.theaterId.setValue(
                settings.movieTheater.id
            );
            await this.changeTheater();
        }
        if (settings.screeningRoom !== undefined) {
            this.settingForm.controls.screenId.setValue(
                settings.screeningRoom.branchCode
            );
        }
        if (settings.page !== undefined) {
            this.settingForm.controls.page.setValue(String(settings.page));
        }
        if (settings.period !== undefined) {
            this.settingForm.controls.period.setValue(String(settings.period));
        }
        if (settings.dateFormat !== undefined) {
            this.settingForm.controls.dateFormat.setValue(
                String(settings.dateFormat)
            );
        }
        if (settings.image !== undefined) {
            this.settingForm.controls.image.setValue(settings.image);
        }

        this.settingForm.controls.direction.setValue(settings.direction);
        this.settingForm.controls.color.setValue(settings.color);
    }

    /**
     * 設定変更
     */
    public async onSubmit() {
        Object.keys(this.settingForm.controls).forEach((key) => {
            this.settingForm.controls[key].markAsTouched();
        });
        if (this.settingForm.invalid) {
            const { settings } = await this.actionService.user.getData();
            const { color } = settings;
            this.utilService.openAlert({
                title: this.translate.instant('common.error'),
                body: this.translate.instant('setting.alert.validation'),
                color,
            });
            return;
        }
        try {
            const theaterId = this.settingForm.controls.theaterId.value;
            const screenId = this.settingForm.controls.screenId.value;
            const page = this.settingForm.controls.page.value;
            const direction = this.settingForm.controls.direction.value;
            const period = Number(this.settingForm.controls.period.value);
            const dateFormat = this.settingForm.controls.dateFormat.value;
            const image =
                this.settingForm.controls.image.value === ''
                    ? undefined
                    : this.settingForm.controls.image.value;
            const color = this.settingForm.controls.color.value;
            const movieTheater = this.movieTheaters.find(
                (t) => t.id === theaterId
            );
            if (movieTheater === undefined) {
                throw new Error('movieTheater not found');
            }
            const screeningRoom = this.screeningRooms.find(
                (s) => s.branchCode === screenId
            );
            this.actionService.user.updateAll({
                movieTheater,
                screeningRoom,
                page: page === '' ? undefined : Number(page),
                direction,
                period,
                dateFormat,
                image,
                color,
            });
            this.utilService.openAlert({
                title: this.translate.instant('common.complete'),
                body: this.translate.instant('setting.alert.success'),
                color,
            });
            Functions.Util.changeViewport({ direction });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 必須判定
     */
    public isRequired(key: String) {
        if (key === 'theaterId' || key === 'direction') {
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

    /**
     * 施設変更
     */
    public async changeTheater() {
        this.settingForm.controls.screenId.setValue('');
        const theaterId = this.settingForm.controls.theaterId.value;
        const findResult = this.movieTheaters.find((t) => t.id === theaterId);
        if (theaterId === '' || findResult === undefined) {
            this.screeningRooms = [];
            return;
        }
        this.screeningRooms = await this.masterService.searchScreeningRooms({
            containedInPlace: {
                branchCode: { $eq: findResult.branchCode },
            },
        });
    }
}
