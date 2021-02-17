import * as bodyParser from 'body-parser';
import * as express from 'express';
import {response, IResponse} from './arm';

export interface ICheckRequiredParams {
    req: any;
    context: string;
    required: Array<string>;
}

export interface IApi {
    route?: string;
    method?: string;
    instance?: any;
    get?: any; // return object from instance like "get('player') from instance.dependencies.player"
    execute?: any;
    funcName?: string;
    executeFirst?: any;
    dependencies?: any; // {playCard: playCard, user: user}
    context: string;
    send?: any;
    res?: any;
    req?: any;
    allowCors?: boolean;
    required?: Array<string>;
    swaggerFilePath?: string;
}

export const checkRequiredParams = (r: ICheckRequiredParams): IResponse | undefined => {
    try {
        if (r.required && r.required.length) {
            const _body = Object.keys(r.req.body),
                _params = Object.keys(r.req.params);

            if (_body.length && _params.length) {
                for (let i = 0; i < r.required.length; i++) {
                    if (_body.indexOf(r.required[i]) < 0) {
                        if (_params.indexOf(r.required[i]) > -1) {
                            continue;
                        }
                        return response(false, `${r.context} '${r.required[i]}' is required`);
                    }
                }
                return response(true, null, true);
            } else {
                const p = _body.length ? _body : (_params.length ? _params : null);
                if (p && p.length) {
                    // indexOf required
                    for (let i = 0; i < r.required.length; i++) {
                        if (p.indexOf(r.required[i]) < 0) {
                            return response(false, `${r.context} '${r.required[i]}' is required`);
                        }
                    }
                    return response(true, null, true);
                }
            }

            return response(false, 'Required parameters do not match requirements!', null);
        }
    } catch (error) {
        console.log(65, error)
    }
}

export class Api {
    app: any;
    dependencies: any; // any object/class like Player, Status, Play, Game

    constructor(dependencies: any) {
        if (dependencies) {
            this.dependencies = dependencies;
        }

        const app = express();
        process.setMaxListeners(Infinity);

        app.use(bodyParser.json({strict: false}));

        app.use(function (req, res, next) {
            res
                .set('Access-Control-Allow-Origin', '*')
                .set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT')
                .set('Access-Control-Allow-Credentials', true)
                .set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With');

            process.on('unhandledRejection', (reason, p) => {
                console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
                // application specific logging, throwing an error, or other logic here
            });
            next();
        });
        app.disable('x-powered-by');

        this.app = app;
    }

    get(dependencyName: string) {
        if (this.dependencies[dependencyName]) {
            return this.dependencies[dependencyName];
        }
        return null;
    }

    routes(params: Array<IApi>) {
        for (let i = 0; i < params.length; i++) {
            let route = params[i]?.route?.toString().trim(), method,
                swaggerFilePath = params[i].swaggerFilePath || '../../swagger';

            if (route!.indexOf(' ') > -1) {
                [method, route] = params[i].route!.split(' ');
            } else {
                route = params[i].route;
                method = (params[i].method === undefined) ? 'get' : params[i]?.method?.toString();
            }
            method = method.toLowerCase();

            const _params = params[i], that = this;
            for (let y = 0; y < 2; y++) {
                let _method = method;
                let _route = route;
                if (y === 0){
                    _method = 'get';
                    _route = `/${params[i]?.funcName?.toString().trim()}`
                }
                this.app[_method](_route, function (req, res) {
                    if (_params.allowCors === undefined) {
                        _params.allowCors = true;
                    }

                    // if (_params.allowCors) {
                    res
                        .set('Access-Control-Allow-Origin', '*')
                        .set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT')
                        .set('Access-Control-Allow-Credentials', true)
                        .set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With');
                    // }

                    if (route!.indexOf('_swagger') > -1) {
                        return res.json(require(swaggerFilePath));
                    } else {
                        if (_params.required && _params.required.length) {
                            const __response = checkRequiredParams({
                                req,
                                required: _params.required,
                                context: _params.context
                            });

                            if (!__response!.success) {
                                return res.status(400).json(__response);
                            }
                        }

                        const p = {
                            res,
                            req,
                            method,
                            instance: that,
                            context: _params.context,
                            execute: _params['execute'],
                            allowCors: _params.allowCors
                        };

                        if (_params.executeFirst) {
                            p['executeFirst'] = _params['executeFirst'];
                        }

                        that.executeRoute(p);
                    }
                });
            }
        }
    }

    async executeRoute(params: IApi): Promise<IResponse | undefined> {

        const execute = params.execute,
            executeFirst = params.executeFirst,
            instance = params.instance;
        let res = params.res, req = params.req;

        try {
            // executeFirst needs to be executed first
            if (executeFirst) {
                const [obj, meth] = params['executeFirst'].split('.');
                const awResult = await instance['dependencies'][obj][meth](
                    params.method === 'get' ? params.req.params : params.req.body,
                    params.method !== 'get' ? params.req.params : instance,
                    params.method !== 'get' ? instance : null);

                if (awResult) {

                    if (awResult.success) {
                        const [obj, meth] = params['execute'].split('.');
                        const _response = await instance['dependencies'][obj][meth](
                            params.method === 'get' ? params.req.params : params.req.body,
                            params.method !== 'get' ? params.req.params : instance,
                            params.method !== 'get' ? instance : null);
                        if (_response) {
                            if (_response.success && _response.data) {
                                if (Array.isArray(_response.data.Items)) {
                                    return res.status(_response.data.Items.length ? 200 : 404).json(response(true, false, _response.data.Items.length > 1 ? _response.data.Items : _response.data.Items[0]));
                                } else {
                                    res.status(200);
                                }
                            } else {
                                res.status(400);
                            }
                        } else {
                            res.status(500);
                        }
                    } else {
                        res.status(400);
                    }
                } else {
                    res.status(500);
                }
                res.json(awResult);
            } else {
                const [obj, meth] = params['execute'].split('.');

                const _response = await instance['dependencies'][obj][meth](
                    params.method === 'get' ? params.req.params : params.req.body,
                    params.method !== 'get' ? params.req.params : instance,
                    params.method !== 'get' ? instance : null);
                if (_response) {
                    if (_response.success && _response.data) {
                        if (Array.isArray(_response.data.Items)) {
                            return res.status(_response.data.Items.length ? 200 : 404).json(response(true, false, _response.data.Items.length > 1 ? _response.data.Items : _response.data.Items[0]));
                        } else {
                            res.status(200);
                        }
                    } else {
                        res.status(400);
                    }
                } else {
                    res.status(500);
                }
                res.json(_response);
            }
        } catch (error) {
            console.log('[api()] error:', error);
            return res.status(500).json(response(false, error.message));
        }
    }
}