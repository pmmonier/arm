import {response, IResponse, ILResponse, lResponse} from "../src";

test('success response', () => {
    const resp : IResponse = {
        success: true,
        error: null,
        data: {example: 'example'}
    }
    expect(JSON.stringify(response(true, null, {example: 'example'}))).toBe(JSON.stringify(resp));
});

test('failed response passing a string', () => {
    const resp : IResponse = {
        success: false,
        error: 'example error',
        data: null
    };
    expect(JSON.stringify(response(false, 'example error'))).toBe(JSON.stringify(resp));
});

test('failed response passing a string and an object in data', () => {
    const resp : IResponse = {
        success: false,
        error: 'example error',
        data: {value: 'value'}
    }
    expect(JSON.stringify(response(false, 'example error', {value: 'value'}))).toBe(JSON.stringify(resp));
});

test('failed response passing an object', () => {
    const resp : IResponse = {
        success: false,
        error: {error: 'example error'},
        data: null
    }
    expect(JSON.stringify(response(false, {error: 'example error'}))).toBe(JSON.stringify(resp));
});

test('failed lResponse passing an object', () => {
    const resp : ILResponse = {
        statusCode: 500,
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : true
        },
        body: JSON.stringify({error: 'example error'})
    };
    expect(JSON.stringify(lResponse(false, {error: 'example error'}))).toBe(JSON.stringify(resp));
});

test('failed lResponse passing a string', () => {
    const resp : ILResponse = {
        statusCode: 500,
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : true
        },
        body: JSON.stringify('example error')
    };
    expect(JSON.stringify(lResponse(false, 'example error'))).toBe(JSON.stringify(resp));
});

test('success lResponse', () => {
    const resp : ILResponse = {
        statusCode: 200,
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : true
        },
        body: JSON.stringify({value: 'value'})
    };
    expect(JSON.stringify(lResponse(true, null, {value: 'value'}))).toBe(JSON.stringify(resp));
});

test('success lResponse passing a failure without error', () => {
    const resp : ILResponse = {
        statusCode: 400,
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials' : true
        },
        body: JSON.stringify(null)
    };
    expect(JSON.stringify(lResponse(false, null))).toBe(JSON.stringify(resp));
});

