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
        if ((/\.(css|js|svg|jpg|png|gif|ico|json|html|txt)/).test(req.path)) {
            res.status(404);
            res.end();
            return;
        }
        next();
    });

    app.use('/api/authorize', authorizeRouter);
    app.use('/api', utilRouter);

    app.get([
        '/projects/:projectId',
        '/projects/:projectId/*'
    ], (req, res, next) => {
        if (req.xhr || req.header('Sec-Fetch-Mode') === 'cors') {
            next();
            return;
        }
        if (req.query.login === 'true'
            && req.query.redirectUrl === undefined) {
            const redirectUrl =
                Buffer.from(req.url.replace('login=', 'login2=')).toString('base64');
            res.redirect(`${req.url}&redirectUrl=${redirectUrl}`);
            return;
        }
        next();
    });

    app.get([
        '/projects/:projectId/:projectName',
        '/projects/:projectId'
    ], (req, res, next) => {
        if (req.xhr || req.header('Sec-Fetch-Mode') === 'cors') {
            next();
            return;
        }
        res.redirect(`/?${getQueryParameter(req)}`);
    });

    app.get('*', (req, res, next) => {
        if (req.xhr || req.header('Sec-Fetch-Mode') === 'cors') {
            next();
            return;
        }
        if (req.session !== undefined) {
            if (req.query.performanceId !== undefined && req.query.eventId === undefined) {
                req.query.eventId = req.query.performanceId;
            }
            req.session.external = req.query;
        }
        res.sendFile(path.resolve(`${__dirname}/../../../client/index.html`), { lastModified: false, etag: false });
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
 * クエリ取得
 */
function getQueryParameter(req: express.Request) {
    let result = `projectId=${req.params.projectId}`;
    if (req.params.projectName !== undefined
        && req.params.projectName === 'print') {
        result += `&projectName=${req.params.projectName}`;
    }
    const query = req.url.split('?')[1];
    if (query !== undefined) {
        result += `&${query}`;
    }
    return result;
}
