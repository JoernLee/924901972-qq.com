import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    // 解构中赋值是默认值，没有传入的时候的值
    const { data = null, url, method = 'get', headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    // 如果配置了Type赋值进去
    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url, true)

    // 这部分是Ajax的基础知识，可以查一下文档求状态
    request.onreadystatechange = function handleLoad() {
      // 4代表成功响应
      if (request.readyState !== 4) {
        return
      }

      if (request.status === 0) {
        return
      }

      // 获取响应的信息
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      // resolve出去，外部Promise可以通过then拿到这个参数
      handleResponse(response)
    }

    request.ontimeout = function handleTimeout(){
      reject(new Error(`Timeout of ${timeout} ms exceed`))
    }

    request.onerror = function handleError() {
      reject(new Error('Network Error'))
    }

    Object.keys(headers).forEach((name) => {
      if (data === null && name.toLowerCase() === 'content-type') {
        // 当没有body数据，content-type是没有意义的
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        // 状态码200-300 代表请求成功
        resolve(response)
      }else {
        reject(new Error(`Request failed with status code ${response.status}`))
      }
    }
  })
}
