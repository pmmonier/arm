// const UuidEncoder = require('uuid-encoder');

export interface IResponse {
    success: boolean;
    error: any;
    data: any;
}

export interface ILResponse {
    statusCode: number;
    headers: any;
    body: string;
}

export const response = (success: boolean, error: any = null, data: any = null): IResponse => {
    return {success, error, data};
};

export const lResponse = (success: boolean, error: any = null, data: any = null): ILResponse => {
    const responseHeaders = {
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Credentials' : true
    };
    if (error) {
        return {
            statusCode: error.code || 500,
            headers: responseHeaders,
            body: JSON.stringify(error)
        };
    }
    return {
        statusCode: success ? 200 : 400,
        headers: responseHeaders,
        body: JSON.stringify(data)
    };
};

export const handledPromise = (promise: Promise<any>, res: any, returnData:boolean = true, executeFirst: any = undefined) => {
    try {
        if (returnData) {
            promise
                .then(_response => {
                    res.json(response(true, null, _response.data));
                })
                .catch(_response => {
                    if (!_response.success) {
                        res.status(400).json(response(false, _response.error));
                    }
                    else {
                        res.status(404).json(response(false, _response.error));
                    }
                });
        } else {
            if (executeFirst) {
                if (executeFirst.success) {
                    promise
                    .then(_response => {
                        res.json(response(true, null, true));
                    })
                    .catch(_response => {
                        if (!_response.success) {
                            res.status(400).json(response(false, _response.error));
                        }
                        else {
                            res.status(404).json(response(false, _response.error));
                        }
                    });
                } else {
                    res.status(400).json(response(false, executeFirst.error));
                }
            } else if(executeFirst == undefined) {
                promise
                    .then(_response => {
                        res.json(response(true, null, true));
                    })
                    .catch(_response => {
                        if (!_response.success) {
                            res.status(400).json(response(false, _response.error));
                        }
                        else {
                            res.status(404).json(response(false, _response.error));
                        }
                    });
            } else {
                res.status(404).json(response(false, executeFirst.error));
            }
        }
    } catch (error) {
        res.status(500).json(response(false, error));
    }
};