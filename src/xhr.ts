import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  // 解构中赋值是默认值，没有传入的时候的值
  const { data = null, url, method = 'get', headers } = config

  const request = new XMLHttpRequest()

  request.open(method.toUpperCase(), url, true)

  Object.keys(headers).forEach((name) => {
    if (data === null && name.toLowerCase() === 'content-type') {
      // 当没有body数据，content-type是没有意义的
      delete headers[name]
    } else {
      request.setRequestHeader(name, headers[name])
    }
  })

  request.send(data)
}
