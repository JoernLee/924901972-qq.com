import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

const defaults: AxiosRequestConfig = {
  method: 'get',

  timeout: 0,

  headers: {
    common: {
      Accept: 'application/json,text/plain,*/*'
    }
  },

  xsrfCookieName: 'XSRF-TOKEN',

  xsrfHeaderName:'X-XSRF-TOKEN',

  transformRequest: [
    // 默认对请求的处理逻辑
    function(data: any, headers?: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],

  transformResponse: [
    function(data:any):any {
      return transformResponse(data)
    }
  ]
}

// 这里用一个数组遍历方式来给上面的headers新增具体method下的处理
const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
