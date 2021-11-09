"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path2Query = void 0;
const http_status_1 = require("http-status");
const path = require("path");
const authorize_1 = require("./api/authorize");
const util_1 = require("./api/util");
exports.default = (app) => {
    app.use((req, res, next) => {
        if (/\.(css|js|svg|jpg|png|gif|ico|json|html|txt)/.test(req.path)) {
            res.status(404);
            res.end();
            return;
        }
        next();
    });
    app.use('/api/authorize', authorize_1.authorizeRouter);
    app.use('/api', util_1.utilRouter);
    app.use((req, res, next) => {
        if (req.xhr || req.header('Sec-Fetch-Mode') === 'cors') {
            res.status(http_status_1.NOT_FOUND);
            res.send('NOT FOUND');
            return;
        }
        next();
    });
    app.get(['/projects/:projectId/setting'], (req, res, _next) => {
        res.redirect(`/?${path2Query(req)}#/setting/extra`);
    });
    app.get(['/projects/:projectId'], (req, res, _next) => {
        res.redirect(`/?${path2Query(req)}`);
    });
    app.get('*', (req, res, next) => {
        if (req.xhr || req.header('Sec-Fetch-Mode') === 'cors') {
            next();
            return;
        }
        if (req.session !== undefined) {
            if (req.query.performanceId !== undefined &&
                req.query.eventId === undefined) {
                req.query.eventId = req.query.performanceId;
            }
            req.session.external = req.query;
        }
        res.sendFile(path.resolve(`${__dirname}/../../../client/index.html`), {
            lastModified: false,
            etag: false,
        });
    });
    app.all('*', (req, res, _next) => {
        res.status(http_status_1.NOT_FOUND);
        if (req.xhr || req.header('Sec-Fetch-Mode') === 'cors') {
            res.json('NOT FOUND');
            return;
        }
    });
};
/**
 * パスパラメータをクエリへ変換
 */
function path2Query(req) {
    let result = `projectId=${req.params.projectId}`;
    const query = req.url.split('?')[1];
    if (query !== undefined) {
        result += `&${query}`;
    }
    return result;
}
exports.path2Query = path2Query;
