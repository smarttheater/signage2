"use strict";
/**
 * API
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilRouter = void 0;
const debug = require("debug");
const express = require("express");
const httpStatus = require("http-status");
const moment = require("moment");
const log = debug('application: /api/util');
const router = express.Router();
/**
 * プロジェクト設定取得
 */
router.post('/project', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    log('project', req.body);
    const response = {
        gmoTokenUrl: process.env.GMO_TOKEN_URL,
        sonyTokenUrl: process.env.SONY_TOKEN_URL,
        env: process.env.APP_ENV,
        gtmId: process.env.GTM_ID,
        analyticsId: process.env.ANALYTICS_ID,
    };
    if (process.env.PROJECT_ID !== undefined && process.env.PROJECT_ID !== '') {
        res.json(Object.assign({ projectId: process.env.PROJECT_ID, projectName: process.env.PROJECT_NAME, storageUrl: {
                application: process.env.PROJECT_STORAGE_URL,
                common: process.env.COMMON_STORAGE_URL,
            } }, response));
        return;
    }
    res.json(Object.assign({ storageUrl: {
            application: process.env.STORAGE_URL,
            common: process.env.COMMON_STORAGE_URL,
        } }, response));
}));
/**
 * サーバータイム取得
 */
router.get('/serverTime', (_req, res) => {
    log('serverTime');
    res.json({ date: moment().toISOString() });
});
/**
 * バージョン取得
 */
router.get('/version', (_req, res) => {
    log('version');
    res.json({ version: process.env.VERSION });
});
/**
 * ヘルスチェック
 */
router.get('/health', (_req, res) => {
    res.status(httpStatus.OK);
    res.send(`${httpStatus.OK} ${httpStatus[200]}`);
});
exports.utilRouter = router;
