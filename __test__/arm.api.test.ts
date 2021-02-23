import { response } from "../src";
import { lambdaRequest, lambdaContext, httpRequest, httpContext, Example } from '../test';

test('lambda execution', async () => {
    const resp = await new Example().handler(lambdaRequest, lambdaContext);
    expect(resp.body).toBe(JSON.stringify(response(true, null, {
        id: '55',
        name: 'Pedro',
        lastName: 'Garcia',
        height: 5.9,
        weight: 170,
        age: 25
    })));
});

test('http request',async () => {
    const resp = await new Example().handler(httpRequest, httpContext);
    expect(resp.body).toBe(JSON.stringify(response(true, null, {
        id: '55',
        name: 'Pedro',
        lastName: 'Garcia',
        height: 5.9,
        weight: 170,
        age: 25
    })));
});