/**
 * 共通
 * @namespace services.util
 */
import debug = require('debug');
import * as request from 'request';
const log = debug('application:util');

export async function requestAsync<T>(url: string, options?: request.CoreOptions) {
    return new Promise<T>((resolve, reject) => {
        log(url, options);
        request(url, options, (error, response, body) => {
            if (error) {
                reject({ error });
                return;
            }
            resolve(<any>{ body, response });
        });
    });
}


/**
 * @memberof services.util
 * @enum DIGITS
 * @type number
 */
export enum DIGITS {
    '02' = -2,
    '03' = -3,
    '08' = -8
}

/**
 * 環境
 * @memberof services.util
 * @enum ENV
 * @type string
 */
export enum ENV {
    /**
     * 開発
     */
    Development = 'development',
    /**
     * テスト
     */
    Test = 'test',
    /**
     * 本番
     */
    Production = 'production'
}

/**
 * HTMLエスケープ
 * @memberof services.util
 * @function escapeHtml
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str: string): string {
    const change = (match: string): string => {
        const changeList: any = {
            '&': '&amp;',
            '\'': '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        };

        return changeList[match];
    };

    return str.replace(/[&'`"<>]/g, change);
}

/**
 * カンマ区切りへ変換
 * @memberof services.util
 * @function formatPrice
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price: number): string {
    return String(price).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

/**
 * ベース64エンコード
 * @memberof services.util
 * @function bace64Encode
 * @param {string} str
 * @returns {string}
 */
export function bace64Encode(str: string): string {
    return new Buffer(str).toString('base64');
}

/**
 * ベース64デコード
 * @memberof services.util
 * @function base64Decode
 * @param {string} str
 * @returns {string}
 */
export function base64Decode(str: string): string {
    return new Buffer(str, 'base64').toString();
}

/**
 * プロジェクト情報取得
 */
export function getProject(params: { projectId: string; projectName?: string; }) {
    const projects: {
        'PROJECT_NAME': string;
        'PROJECT_ID': string;
        'STORAGE_URL': string;
    }[] = JSON.parse(<string>process.env.PROJECTS);
    return projects.find(p => {
        return (params.projectName === undefined)
            ? p.PROJECT_ID === params.projectId
            : p.PROJECT_ID === params.projectId && p.PROJECT_NAME === params.projectName;
    });
}
