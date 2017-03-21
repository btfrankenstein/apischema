/*
  String Number Date Boolean Array
  export const getCategorys = schema.define('', {
    page: Number,
    url: String,
  });
*/

import { encode } from 'querystring';

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
  const io = config.http;
  return {
    combineUrl(method, url, params) {
      // 替换path参数
      let combineUrl = url.replace(/\{([a-zA-Z]*)\}/g, ($1, $2) => {
        console.log($1, $2);
        return params[$2];
      });
      if (method === 'get') {
        const query = encode(params);
        const split = url.indexOf('?') === -1 ? '?' : '&';
        combineUrl = query ? `${combineUrl}${split}${query}` : combineUrl;
      }
      return combineUrl;
    },
    define(url, schema = {}, method = 'get') {
      return (params) => {
        // 最终发送给接口的参数
        let sendParams = {};

        // 验证请求参数的合法性
        Object.keys(schema).forEach((param) => {
          if (schema[param].required && !params[param]) throw new TypeError(`缺少参数：请添加${param}参数`);
          if (schema[param].type !== schemaTypes[getType(params[param])]) {
            throw new TypeError(`类型错误：参数${param}类型错误`);
          }
          // 如果只是用于接口URL中的参数，则不加入进最终发送给接口的参数
          if(!schema[param].urlOnly) {
            sendParams[param] = params[param];
          }
        });

        return io[method](this.combineUrl(method, url, params), sendParams);
      };
    },
    get(url, schema) {
      return this.define(url, schema);
    },
    post(url, schema) {
      return this.define(url, schema, 'post');
    },
    delete(url, schema) {
      return this.define(url, schema, 'delete');
    },
    put(url, schema) {
      return this.define(url, schema, 'put');
    },
  };
};
