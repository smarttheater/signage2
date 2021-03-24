/**
 * 認証API
 */
import * as debug from 'debug';
import * as express from 'express';
import { errorProsess } from '../../functions/base';
import { AuthModel } from '../../models/auth/auth.model';
const router = express.Router();
const log = debug('application: /api/authorize');

/**
 * 認証情報取得
 */
router.post('/getCredentials', async (req, res) => {
    log('getCredentials', req.body.member);
    try {
        let authModel;
        const endpoint = <string>process.env.API_ENDPOINT;
        const waiterServerUrl = <string>process.env.WAITER_SERVER_URL;
        if (req.body.member === '0') {
            authModel = new AuthModel();
        } else {
            throw new Error('member does not macth MemberType');
        }
        const options = {
            endpoint,
            auth: authModel.create()
        };
        const accessToken = await options.auth.getAccessToken();
        const expiryDate = options.auth.credentials.expiry_date;
        const clientId = options.auth.options.clientId;
        res.json({ accessToken, expiryDate, clientId, endpoint, waiterServerUrl });
    } catch (error) {
        errorProsess(res, error);
    }
});

export const authorizeRouter = router;
