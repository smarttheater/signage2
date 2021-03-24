/**
 * API
 */

import * as debug from 'debug';
import * as express from 'express';
import * as httpStatus from 'http-status';
import * as moment from 'moment';
const log = debug('application: /api/util');
const router = express.Router();

/**
 * プロジェクト設定取得
 */
router.post('/project', async (req, res) => {
    log('project', req.body);
    const response = {
        gmoTokenUrl: process.env.GMO_TOKEN_URL,
        sonyTokenUrl: process.env.SONY_TOKEN_URL,
        env: process.env.APP_ENV,
        gtmId: process.env.GTM_ID,
        analyticsId: process.env.ANALYTICS_ID
    };
    if (process.env.PROJECT_ID !== undefined && process.env.PROJECT_ID !== '') {
        res.json({
            projectId: process.env.PROJECT_ID,
            projectName: process.env.PROJECT_NAME,
            storageUrl: process.env.PROJECT_STORAGE_URL,
            ...response
        });
        return;
    }
    res.json({
        storageUrl: process.env.STORAGE_URL,
        ...response
    });
});

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

export const utilRouter = router;
