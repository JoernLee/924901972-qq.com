import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    // 解构中赋值是默认值，没有传入的时候的值
    const { data = null, url, method = 'get', headers, responseType, timeout, cancelToken,withCredentials } = config

    const request = new XMLHttpRequest()

    // 如果配置了Type赋值进去
    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    if (withCredentials) {
      request.withCredentials = withCredentials
    }

    request.open(method.toUpperCase(), url!, true)

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

    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceed`, config, 'ECONNABORTED', request))
    }

    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }

    Object.keys(headers).forEach((name) => {
      if (data === null && name.toLowerCase() === 'content-type') {
        // 当没有body数据，content-type是没有意义的
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    // 加上取消的逻辑-cancelToken是CancelToken类实例
    // 实例化的时候会执行构造逻辑，构造pending状态promise
    // 接着立即调用方法，其中会把pending状态改为resolved状态，进而进入下面then逻辑
    if (cancelToken) {
      cancelToken.promise.then(reason => {
        // 取消请求
        request.abort()
        reject(reason)
      })
    }

    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        // 状态码200-300 代表请求成功
        resolve(response)
      } else {
        reject(createError(`Request failed with status code ${response.status}`, config, null, request, response))
      }
    }
  })
}
