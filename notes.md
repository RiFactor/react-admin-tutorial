[Tutorial]()

### Connecting To A Real API

|                  | Action              | Expected API request                                                                  |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------- |
| getList          | Get list            | GET http://my.api.url/posts?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"} |
| getOne           | Get one record      | GET http://my.api.url/posts/123                                                       |
| getMany          | Get several records | GET http://my.api.url/posts?filter={"id":[123,456,789]}                               |
| getManyReference | Get related records | GET http://my.api.url/posts?filter={"author_id":345}                                  |
| create           | Create a record     | POST http://my.api.url/posts                                                          |
| update           | Update a record     | PUT http://my.api.url/posts/123                                                       |
| updateMany       | Update records      | PUT http://my.api.url/posts?filter={"id":[123,124,125]}                               |
| delete           | Delete a record     | DELETE http://my.api.url/posts/123                                                    |
| deleteMany       | Delete records      | DELETE http://my.api.url/posts?filter={"id":[123,124,125]}                            |

React-admin calls the Data Provider with one method for each of the actions of this list, and expects a Promise in return. It’s the Data Provider’s job to emit HTTP requests and transform the response into the format expected by react-admin.

The code for a Data Provider for the my.api.url API is as follows:

```typescript
// Data Provider example for REST API
// in src/dataProvider.ts
import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl = "https://my.api.com/";
const httpClient = fetchUtils.fetchJson;

// TypeScript users must reference the type `DataProvider`
export const dataProvider = {
  getList: (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json,
      total: parseInt(
        (headers.get("content-range") || "0").split("/").pop() || 0,
        10
      ),
    }));
  },

  getOne: (resource: any, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    })),

  getMany: (resource: any, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({ data: json }));
  },

  getManyReference: (resource: any, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json,
      total: parseInt(
        (headers.get("content-range") || "0").split("/").pop() || 0,
        10
      ),
    }));
  },

  update: (resource: any, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  updateMany: (resource: any, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource: any, params: any) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    })),

  delete: (resource: any, params: any) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),

  deleteMany: (resource: any, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json }));
  },
};
```

Tip: fetchUtils.fetchJson() is just a shortcut for fetch().then(r => r.json()), plus a control of the HTTP response code to throw an HTTPError in case of 4xx or 5xx response. Feel free to use fetch() directly if it doesn’t suit your needs.
