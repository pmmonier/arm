import * as test from 'tape';
import * as request from 'supertest';
import {response} from './arm';

export interface ITestApi {
    handler?: any;
    description?: string;
    context?: string;
    route?: string;
    execute?: any; // promise to execute
    method?: string;
    send?: any;
    expectedCode?: number;
    contentType?: string;
    showResults?: boolean;
    expected?: any;
    emptyResultExpected?: boolean;
    failureExpected?: boolean;
    compared?: any;
    comparison?: string;
}

export class TestApi {
    private app: any;

    constructor(app) {
        this.app = app;
        process.setMaxListeners(Infinity);
    }

    test(params: Array<ITestApi>) {
        for (let i = 0; i < params.length; i++) {
            test(`${i+1}) ${params[i].description}`, t => {
                this.__test(t, params[i]);
            });
        }
    }

    __test(t: any, params: ITestApi) {
        const app = this.app;
        // double Promises to avoid unhandled promises
        return new Promise((_res, _rej) => {
            return new Promise((__res, __rej) => {
                try {
                    // do we have a promise to execute instead of a REST API request?
                    if (params.execute && params.execute.then) {
                        return params.execute
                            .then(success => {
                                __res(true);
                                _res(true);
                                t.error(false, 'No error');
                                t.end();
                            })
                            .catch(err => {
                                __rej(err);
                                t.error(true, err);
                                t.end();
                            });
                    }

                    const expectedCode = params.expectedCode || 200,
                        send = params.send || null,
                        contentType = params.contentType || /json/,
                        showResults = (params.showResults === undefined) ? true : params.showResults;

                    let route = params.route!.toString().trim(), method;

                    if (route.indexOf(' ') > -1) {
                        [method, route] = params.route!.split(' ');
                    } else {
                        route = params.route || '';
                        method = (params.method === undefined) ? 'get' : params.method.toString().toLowerCase();
                    }

                    const r = request(app)[method](route);

                    if (send) {
                        r.send(send);
                    }

                    r.expect('Content-Type', contentType);
                    r.expect(expectedCode);
                    r.end((err, res) => {
                        if (err) {
                            t.error(true, res.body.error || err);
                            __rej(err.message);
                        } else {
                            if (showResults) {
                                console.log('[showResults: ON]:', res.body);
                            }

                            // compared is null, it means it is expecting body.data
                            if (params.expected && !params.compared) {
                                console.log('comparing with body.data');
                                params.compared = res.body.data;
                            }

                            if (params.compared && params.expected && params.expected.length) {
                                const expected = {};
                                for (let i=0; i< params.expected.length; i++) {
                                    expected[params.expected[i]] = res.body.data[params.expected[i]];
                                }

                                t.same(params.compared, expected, `'${params.context}' info matches as expected`);
                            } else {
                                if ((!res.body.data && !res.body.swagger) ||
                                    (Array.isArray(res.body.data) && !res.body.data.length)) {
                                    if(!res.body.error && (params.emptyResultExpected || params.failureExpected || send)) {
                                        t.error(false, 'No error');
                                    } else {
                                        if (!res.body.success && params.emptyResultExpected) {
                                            t.error(false, 'No error');
                                        } else {
                                            t.error(true, '[114] Empty array returned');
                                        }
                                    }
                                } else {
                                    if(res.body.swagger || res.body.success || params.failureExpected) {
                                        // if (res.body.data && res.body.data.Items && !res.body.data.Items.length
                                        if ( (res.body.data && Array.isArray(res.body.data) && !res.body.data.length) || !res.body.data
                                            && !params.emptyResultExpected ) {
                                            t.error(true, '[120] Empty array/value returned');
                                        } else {
                                            t.error(false, 'No error');
                                        }

                                    } else {
                                        t.error(true, res.body.error);
                                    }
                                }
                            }
                            __res(true);
                            _res(res.body);
                        }
                        t.end();
                    });
                } catch(error) {
                    console.log('138 tools.test.__test()', error);
                    __rej(response(false, error.message));
                }
            })
            .catch(errorResponse => {
                console.log('143 tools.test.__test()', errorResponse);
                _res(errorResponse);
            });
        });
    }
}