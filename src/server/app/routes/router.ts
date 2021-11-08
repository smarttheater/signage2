/**
 * ルーティング
 */
import * as express from 'express';
import { NOT_FOUND } from 'http-status';
import * as path from 'path';
import { authorizeRouter } from './api/authorize';
import { utilRouter } from './api/util';

export default (app: express.Application) => {
    app.use((req, res, next) => {
        if (/\.(css|js|svg|jpg|png|gif|ico|json|html|txt)/.test(req.path)) {
            res.status(404);
            res.end();
            return;
        }
        next();
    });

    app.use('/api/authorize', authorizeRouter);
    app.use('/api', utilRouter);

    app.use((req, res, next) => {
        if (req.xhr || req.header('Sec-Fetch-Mode') === 'cors') {
            res.status(NOT_FOUND);
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
            if (
                req.query.performanceId !== undefined &&
                req.query.eventId === undefined
            ) {
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
        res.status(NOT_FOUND);
        if (req.xhr || req.header('Sec-Fetch-Mode') === 'cors') {
            res.json('NOT FOUND');
            return;
        }
    });
};

/**
 * パスパラメータをクエリへ変換
 */
export function path2Query(req: express.Request) {
    let result = `projectId=${req.params.projectId}`;
    const query = req.url.split('?')[1];
    if (query !== undefined) {
        result += `&${query}`;
    }
    return result;
}
