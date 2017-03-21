# apischema

## Useage
```
export const getCategorys = schema.get('/api/getcategorys/{page}', {
  page: { type: Number, required: true, urlOnly: true },
  type: { type: Number, required: true },
});

getCategorys({ page: 1, type: 1 }).then((json) => {
  log(json);  
});
```
