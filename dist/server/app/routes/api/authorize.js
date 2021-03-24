"use strict";
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
exports.authorizeRouter = void 0;
/**
 * 認証API
 */
const debug = require("debug");
const express = require("express");
const base_1 = require("../../functions/base");
const auth_model_1 = require("../../models/auth/auth.model");
const router = express.Router();
const log = debug('application: /api/authorize');
/**
 * 認証情報取得
 */
router.post('/getCredentials', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    log('getCredentials', req.body.member);
    try {
        let authModel;
        const endpoint = process.env.API_ENDPOINT;
        const waiterServerUrl = process.env.WAITER_SERVER_URL;
        if (req.body.member === '0') {
            authModel = new auth_model_1.AuthModel();
        }
        else {
            throw new Error('member does not macth MemberType');
        }
        const options = {
            endpoint,
            auth: authModel.create()
        };
        const accessToken = yield options.auth.getAccessToken();
        const expiryDate = options.auth.credentials.expiry_date;
        const clientId = options.auth.options.clientId;
        res.json({ accessToken, expiryDate, clientId, endpoint, waiterServerUrl });
    }
    catch (error) {
        base_1.errorProsess(res, error);
    }
}));
exports.authorizeRouter = router;
