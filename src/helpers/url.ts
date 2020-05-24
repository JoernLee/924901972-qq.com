import { isDate, isPlainObject } from './util'

/** 存放URL相关工具函数 */
interface URLOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  // 还需要处理一些特殊字符,将他们转化回来
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }

  // 定义一个键值对数组用来存params
  const parts: string[] = []

  // 遍历params中的key-value
  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || typeof val === 'undefined') {
      return
    }
    // 判断val（值）是不是数组,如果是的话key后面需要加[]
    // 如果不是则变成一个数组，方便后面统一处理value(不需要单独处理数组的情况)
    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    // 下面主要是value为数组时候的逻辑但是因为上面的代码非数组也可以用
    values.forEach(val => {
      // 对类型进行判断
      if (isDate(val)) {
        // 因为有类型保护才可以使用Date的方法
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  // 最后需要把parts中通过符号连接起来
  let serializedParams = parts.join('&')
  if (serializedParams) {
    // 处理如果存在# hash的情况下（忽略）
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // 判断url传进来是否有'?'，分别处理
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

export function isURLSameOrigin(requestURL: string): boolean {
  // 技巧：创建一个a标签，把url设置过去,然后就可以解构拿到参数
  const parsedOrigin = resolveURL(requestURL)
  return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host)
}

// 当前页面的源信息
const currentOrigin = resolveURL(window.location.href)

const urlParsingNode = document.createElement('a')

function resolveURL(url: string): URLOrigin {

  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
