import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  // 解构中赋值是默认值，没有传入的时候的值
  const { data = null, url, method = 'get' } = config

  const request = new XMLHttpRequest()

  request.open(method.toUpperCase(), url, true)

  request.send(data)
}
