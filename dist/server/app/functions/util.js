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
exports.generateUuid = exports.getProject = exports.formatPrice = exports.escapeHtml = exports.ENV = exports.DIGITS = exports.requestAsync = void 0;
/**
 * 共通
 * @namespace services.util
 */
const debug = require("debug");
const request = require("request");
const log = debug('application:util');
function requestAsync(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            log(url, options);
            request(url, options, (error, response, body) => {
                if (error) {
                    reject({ error });
                    return;
                }
                resolve({ body, response });
            });
        });
    });
}
exports.requestAsync = requestAsync;
/**
 * @memberof services.util
 * @enum DIGITS
 * @type number
 */
var DIGITS;
(function (DIGITS) {
    DIGITS[DIGITS["02"] = -2] = "02";
    DIGITS[DIGITS["03"] = -3] = "03";
    DIGITS[DIGITS["08"] = -8] = "08";
})(DIGITS = exports.DIGITS || (exports.DIGITS = {}));
/**
 * 環境
 * @memberof services.util
 * @enum ENV
 * @type string
 */
var ENV;
(function (ENV) {
    /**
     * 開発
     */
    ENV["Development"] = "development";
    /**
     * テスト
     */
    ENV["Test"] = "test";
    /**
     * 本番
     */
    ENV["Production"] = "production";
})(ENV = exports.ENV || (exports.ENV = {}));
/**
 * HTMLエスケープ
 * @memberof services.util
 * @function escapeHtml
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
    const change = (match) => {
        const changeList = {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        };
        return changeList[match];
    };
    return str.replace(/[&'`"<>]/g, change);
}
exports.escapeHtml = escapeHtml;
/**
 * カンマ区切りへ変換
 * @memberof services.util
 * @function formatPrice
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
    return String(price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}
exports.formatPrice = formatPrice;
/**
 * プロジェクト情報取得
 */
function getProject(params) {
    const projects = JSON.parse(process.env.PROJECTS);
    return projects.find((p) => {
        return params.projectName === undefined
            ? p.PROJECT_ID === params.projectId
            : p.PROJECT_ID === params.projectId &&
                p.PROJECT_NAME === params.projectName;
    });
}
exports.getProject = getProject;
/**
 * UUIDv4の生成
 */
function generateUuid() {
    const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('');
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case 'x':
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case 'y':
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join('');
}
exports.generateUuid = generateUuid;
