import { AxiosRequestConfig } from '../types'

// 定义合并策略的Map，通过Key找到值
const strats = Object.create(null)

// 默认合并策略
function defaultStrat(val1: any, val2: any) {
  // 默认优先取val2的值
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 只取val2的值，忽略val1
function fromVal2Strat(val1: any, val2: any) {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 定义不同key并将对应策略存入
const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

// 将两个config合并
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  // config1也要遍历
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  // 合并策略函数，将返回结果添加到config中
  function mergeField(key: string) {
    // 如果搜索不到，使用默认策略
    const strat = strats[key] || defaultStrat
    // 这里需要添加一个字符串索引签名，不然TS会报错
    // 这里需要断言config2，因为这是另一个函数，推断不出来了
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
