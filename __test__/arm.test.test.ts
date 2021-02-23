import {TestApi} from '../src';

const testApi = new TestApi(require("../test").test);


test('test suite', async () => {
    await expect(new Promise((res, rej) => {
        testApi.test([
            {
                description: "Should create Student",
                context: 'create student',
                route: '/api/student',
                method: 'put',
                send: {
                    id: '55',
                    name: 'Pedro',
                    lastName: 'Garcia',
                    height: 5.9,
                    weight: 170,
                    age: 20
                },
                emptyResultExpected: true,
                showResults: true
            },
            {
                description: "Should not create Student",
                context: 'create student',
                route: '/api/student',
                method: 'put',
                send: {
                    id: '55',
                    name: 'Pedro',
                    lastName: 'Garcia',
                    height: 5.9,
                    weight: 170
                },
                failureExpected: true,
                expectedCode: 400,
                emptyResultExpected: true,
                showResults: true
            },
            {
                description: "Should get fullName",
                context: 'get fullName',
                route: '/api/student/55',
                method: 'get',
                compared: {
                    fullName: 'Pedro Garcia'
                },
                expected: ['fullName'],
                showResults: true
            },
            {
                description: "Should not get fullName",
                context: 'get fullName',
                route: '/api/students/55',
                method: 'get',
                contentType: 'text/html; charset=utf-8',
                failureExpected: true,
                expectedCode: 404,
                showResults: true
            },
            {
                description: "Should update Student",
                context: 'update student',
                route: '/api/student/55',
                method: 'patch',
                send: { age: 20 },
                compared: {
                    id: '55',
                    name: 'Pedro',
                    lastName: 'Garcia',
                    height: 5.9,
                    weight: 170,
                    age: 20
                },
                expected: ['id', 'name', 'lastName', 'height', 'weight', 'age'],
                showResults: true
            }
        ])
        setTimeout(() => {
            res(true);
        }, 70)
    })).resolves.toBeTruthy();
});