import xhr from './xhr'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'


export default function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then((res) => {
    return transformResponseData(res)
  })
}

// 用于对传入的config做处理，不仅仅只是url的参数处理
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  // headers处理逻辑要放前面，因为transformData时候把data字段转化为字符串了，所以先处理header
  // config.headers = transformHeaders(config)
  // config.data = transformRequestData(config)
  // 使用transform函数重构
  config.data = transform(config.data, config.headers, config.transformRequest)
  // 合并headers中字段---config处理时候运行时method一定存在
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  // 使用transform重构
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}
