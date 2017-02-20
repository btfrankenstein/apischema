/*
  String Number Date Boolean Array
  export const getCategorys = schema.define('', {
    page: Number,
    url: String,
  });
*/
const schemaTypes = {
  number: Number,
  string: String,
  // 其它类型后续扩展
};

// 临时测试方法
const getType = (value) => {
  let type = '';
  if (typeof value === 'string') type = 'string';
  if (typeof value === 'number') type = 'number';
  return type;
};

export default (config) => {
  io = config.http;
  return {
    define(url, schema = {}, method = 'get') {
      return (params) => {
        // 验证请求参数的合法性
        Object.keys(schema).forEach((param) => {
          if (schema[param].required && !params[param]) throw new TypeError(`缺少参数：请添加${param}参数`);
          if (schema[param].type !== schemaTypes[getType(params[param])]) {
            throw new TypeError(`类型错误：参数${param}类型错误`);
          }
        });
        // 替换path参数
        const combineUrl = url.replace(/\$\{([a-zA-Z]*)\}/g, ($1, $2) => {
          console.log($1, $2);
          return params[$2];
        });
        return io[method](combineUrl, params);
      };
    },
    get(url, schema) {
      return this.define(url, schema);
    },
    post(url, schema) {
      return this.define(url, schema, 'post');
    },
  };
};