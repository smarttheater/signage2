import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { factory } from '@cinerino/sdk';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Functions, Models } from '../../../../..';
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
    public movieTheaters: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom[];
    public screeningRooms: factory.chevre.place.screeningRoom.IPlace[];
    public pages: string[];
    public environment = getEnvironment();
    public direction = Models.Common.Direction;
    public layout = Models.Common.Layout;

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
        this.movieTheaters = [];
        this.screeningRooms = [];
        this.pages = [...Array(10).keys()].map(i => String(++i));
        try {
            this.movieTheaters = await this.masterService.searchMovieTheaters();
            await this.createSettlingForm();
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
            layout: ['', [Validators.required]],
        });
        const user = await this.actionService.user.getData();
        if (user.movieTheater !== undefined) {
            this.settingForm.controls.theaterId.setValue(user.movieTheater.id);
            await this.changeTheater();
        }
        if (user.screeningRoom !== undefined) {
            this.settingForm.controls.screenId.setValue(user.screeningRoom.branchCode);
        }
        if (user.page !== undefined) {
            this.settingForm.controls.page.setValue(String(user.page));
        }
        this.settingForm.controls.direction.setValue(user.direction);
        this.settingForm.controls.layout.setValue(user.layout);
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
            const screenId = this.settingForm.controls.screenId.value;
            const page = this.settingForm.controls.page.value;
            const direction = this.settingForm.controls.direction.value;
            const layout = this.settingForm.controls.layout.value;
            const movieTheater = this.movieTheaters.find(t => (t.id === theaterId));
            if (movieTheater === undefined) {
                throw new Error('movieTheater not found');
            }
            const screeningRoom = this.screeningRooms.find(s => (s.branchCode === screenId));
            this.actionService.user.updateAll({
                movieTheater,
                screeningRoom,
                page: (page === '') ? undefined : Number(page),
                direction,
                layout
            });
            this.utilService.openAlert({
                title: this.translate.instant('common.complete'),
                body: this.translate.instant('setting.alert.success')
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
        if (key === 'theaterId') {
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
        const findResult = this.movieTheaters.find(t => (t.id === theaterId));
        if (theaterId === '' || findResult === undefined) {
            this.screeningRooms = [];
            return;
        }
        this.screeningRooms = await this.masterService.searchScreeningRooms({
            containedInPlace: {
                branchCode: { $eq: findResult.branchCode }
            }
        });
    }

}
