import {Api, IApi, lResponse, IResponse, response} from "../src";

const serverless = require('serverless-http');

export class Example {
    async getLoads(event: { params: { kind: string }, source?: any }, context: any, callback: any, api: IApi) {
        try {
            // console.log('input', event.params)
            // const Load = api.get('load');
            // const executed = await Load.getAll(event.params, api);
            // if (executed.success) {
            //     console.log(77, executed)
            //     return lResponse(true, false, executed.data);
            // } else {
            //     return lResponse(false, executed.error);
            // }
        } catch (err) {
            return lResponse(false, err);
        }
    }

    async getFullName(params: { id: string }, api?: IApi): Promise<IResponse> {
        try {
            let student = {
                id: '55',
                name: 'Pedro',
                lastName: 'Garcia',
                height: 5.9,
                weight: 170,
                age: 20
            };
            if (params.id != student.id)
                return response(false, 'Invalid Student ID');
            return response(true, null, {fullName: student.name + ' ' + student.lastName});
        } catch (error) {
            return response(false, error)
        }
    }

    async update(body: { age: number }, params: { id: string }, api: IApi): Promise<IResponse> {
        try {
            let student = {
                id: '55',
                name: 'Pedro',
                lastName: 'Garcia',
                height: 5.9,
                weight: 170,
                age: 20
            };
            if (params.id != student.id)
                return response(false, 'Invalid Student ID');
            student.age = body.age;
            return response(true, null, student);
        } catch (error) {
            return response(false, error)
        }
    }

    async create(body: any , params: null, api: IApi): Promise<IResponse> {
        try {
            let student = {
                id: '55',
                name: 'Pedro',
                lastName: 'Garcia',
                height: 5.9,
                weight: 170,
                age: 20
            };
            const studentKeys = Object.keys(student).sort();
            const bodyKeys = Object.keys(body).sort();
            if (JSON.stringify(studentKeys) !== JSON.stringify(bodyKeys))
                return response(false, 'Invalid Student');
            return response(true, null, {});
        } catch (error) {
            return response(false, error)
        }
    }

    async handler(event, context) {
        if (!event.resource) {
            const url = `/${context.functionName}`;
            event['resource'] = url;
            event['path'] = url;
            event['httpMethod'] = 'POST';
        }
        const handler = serverless(api.app);
        return await handler(event, context);
    }
}

const api = new Api({
    example: new Example()
}, 'testing');

api.routes([
    {
        route: "patch /api/student/:id",
        context: "Student",
        execute: 'example.update',
        funcName: 'update',
        required: ['id']
    },
    {
        route: "get /api/student/:id",
        context: "Student",
        execute: 'example.getFullName',
        funcName: 'getFullName',
        required: ['id']
    },
    {
        route: "put /api/student",
        context: "Student",
        execute: 'example.create',
        funcName: 'create',
        required: []
    }
]);

export const lambdaRequest = {
    params: { id: '55'},
    body: {
        age: 25
    }
};
export const lambdaContext = {
    callbackWaitsForEmptyEventLoop: {},
    succeed: {},
    fail: {},
    done: {},
    functionVersion: "$LATEST",
    functionName: "testing-update",
    memoryLimitInMB: "1024",
    logGroupName: "/aws/lambda/testing-update",
    logStreamName: "2021/02/22/[$LATEST]f8f12df9b7b2435b8b40fc7cf79d899f",
    clientContext: "undefined",
    identity: "undefined",
    invokedFunctionArn: "arn:aws:lambda:us-east-1:************:function:testing-update",
    awsRequestId: "1b0e5ce4-563e-41c5-93ad-6e65e152f4f6",
    getRemainingTimeInMillis: {}
};
export const httpRequest = {
    resource: "/api/student/{id}",
    path: "/api/student/55",
    httpMethod: "PATCH",
    headers: {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "US",
        "Content-Type": "application/json",
        "Host": "s1lqpt3yog.execute-api.us-east-1.amazonaws.com",
        "Postman-Token": "9d9335b6-10fd-413f-b9fd-4c7e74bc4fcc",
        "User-Agent": "PostmanRuntime/7.26.8",
        "Via": "1.1 def0129a2302392e8516d5fa4b6af477.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "0oY_RAg_kzAPdAc6sVhFZbJFvpWeQU1_Fy1r01eFpwoVvXTecgfqGQ==",
        "X-Amzn-Trace-Id": "Root=1-60341cd7-7c0f6e7c70390afe796b1d9b",
        "X-Forwarded-For": "65.154.216.120, 52.46.25.89",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    multiValueHeaders: {
        "Accept": ["*/*"],
        "Accept-Encoding": ["gzip, deflate, br"],
        "CloudFront-Forwarded-Proto": ["https"],
        "CloudFront-Is-Desktop-Viewer": ["true"],
        "CloudFront-Is-Mobile-Viewer": ["false"],
        "CloudFront-Is-SmartTV-Viewer": ["false"],
        "CloudFront-Is-Tablet-Viewer": ["false"],
        "CloudFront-Viewer-Country": ["US"],
        "Content-Type": ["application/json"],
        "Host": ["s1lqpt3yog.execute-api.us-east-1.amazonaws.com"],
        "Postman-Token": ["9d9335b6-10fd-413f-b9fd-4c7e74bc4fcc"],
        "User-Agent": ["PostmanRuntime/7.26.8"],
        "Via": ["1.1 def0129a2302392e8516d5fa4b6af477.cloudfront.net (CloudFront)"],
        "X-Amz-Cf-Id": ["0oY_RAg_kzAPdAc6sVhFZbJFvpWeQU1_Fy1r01eFpwoVvXTecgfqGQ=="],
        "X-Amzn-Trace-Id": ["Root=1-60341cd7-7c0f6e7c70390afe796b1d9b"],
        "X-Forwarded-For": ["65.154.216.120, 52.46.25.89"],
        "X-Forwarded-Port": ["443"],
        "X-Forwarded-Proto": ["https"]
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: {
        id: "55"
    },
    stageVariables: null,
    requestContext: {
        resourceId: "hnav91",
        resourcePath: "/api/student/{id}",
        httpMethod: "PATCH",
        extendedRequestId: "bKlxsGbXIAMF6Rg=",
        requestTime: "22/Feb/2021:21:06:31 +0000",
        path: "/dev/api/student/55",
        accountId: "************",
        protocol: "HTTP/1.1",
        stage: "dev",
        domainPrefix: "s1lqpt3yog",
        requestTimeEpoch: 1614027991507,
        requestId: "299f4d3c-2ab7-494e-b5bb-c1becb95ad02",
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: "65.154.216.120",
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: "PostmanRuntime/7.26.8",
            user: null
        },
        domainName: "s1lqpt3yog.execute-api.us-east-1.amazonaws.com",
        apiId: "s1lqpt3yog"
    },
    body: {
        age: 25
    },
    isBase64Encoded: false
};
export const httpContext = {
    callbackWaitsForEmptyEventLoop: {},
    succeed: {},
    fail: {},
    done: {},
    functionVersion: "$LATEST",
    functionName: "testing-update",
    memoryLimitInMB: "1024",
    logGroupName: "/aws/lambda/testing-update",
    logStreamName: "2021/02/22/[$LATEST]f1f8f043cd2f44999c8c847c19e788e7",
    clientContext: "undefined",
    identity: "undefined",
    invokedFunctionArn: "arn:aws:lambda:us-east-1:************:function:testing-update",
    awsRequestId: "f4f2e8d8-d8e5-4ac9-b9d0-81bb3f0b4b8a",
    getRemainingTimeInMillis: {}
};
export const test = api.app; // mandatory for supertest