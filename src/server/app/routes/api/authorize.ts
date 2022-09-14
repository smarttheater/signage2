/**
 * 認証API
 */
import * as debug from 'debug';
import * as express from 'express';
import { errorProsess } from '../../functions/base';
import { generateUuid } from '../../functions/util';
import axios from 'axios';
import { stringify } from 'querystring';
const router = express.Router();
const log = debug('application: /api/authorize');

/**
 * 認証情報取得(API版)
 */
 router.post('/getCredentailsApi', async (_req, res) => {
    log('getCredentailsApi', _req);
    try {
        const url = `${process.env.SMART_THEATER_AUTH_ENDPOINT}/oauth2/token`;
        const form = {
            state: generateUuid(),
            grant_type: 'client_credentials',
        };
        // tslint:disable-next-line:max-line-length
        const secret = Buffer.from(`${process.env.CLIENT_CREDENTIALS_CLIENT_ID}:${process.env.CLIENT_CREDENTIALS_CLIENT_SECRET}`, 'utf8').toString('base64');
        const result = (
            await axios.post(url, stringify(form), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${secret}`,
                },
            })
        ).data as { access_token: string; token_type: string; expires_in: number };
        res.json({
            accessToken: result.access_token,
            tokenType: result.token_type,
            expiryDate: result.expires_in,
            apiEndpoint: process.env.SMART_THEATER_API_ENDPOINT
        });
    } catch (error) {
        errorProsess(res, error);
    }
});

export const authorizeRouter = router;
