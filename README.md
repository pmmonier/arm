# arm

AWS Route Management.

## Installation 

```bash
  npm install --save aws-route-management
```

## Import

```javascript
  import {Api, response, lResponse, IResponse} from 'aws-route-management';
```

## Usage

```javascript
  
  class Cat {
    async get(p: {id: string}, api: IApi): Promise<IResponse> {
        try {
            //first find cat by id.. 
            return response(true, null, {name: 'Tom', color: 'black'})
        } catch (error) {
            return response(false, error)
        }
      }
   }
   
   const api = new Api({
      cat: new Cat()
    });
    
    api.routes([
        {
            route: "get /cat/id/:id",
            context: "Cat service",
            execute: 'cat.get',
            required: ['id']
        }
    ]);
    
    module.exports = {
        handler: serverless(api.app),
        test: api.app, // mandatory for supertest
        cat: Cat,
        eventGet: async function (event: { params: {id: string}, source?:any}, context: any, callback: any) {
          try {
              const executed = await api.get('cat').get(event.params, api);
              if (executed.success) {
                  return lResponse(true, false, executed.data);
              } else {
                  return lResponse(false, executed.error);
              }
          } catch (err) {
              return lResponse(false, err);
          }
      }
    };
    
    
    import {TestApi, Api} from 'aws-route-management';
    
    const Cat = require('../main').cat;
    
    const api = new Api({
        cat: new Cat()
    });
    
    const testApi = new TestApi(app);
    testApi.test([
        {
            description: "Should get a cat",
            execute: api.get('cat').get({ id: '1111' }, api),
            showResults: true
        }
    ]);
