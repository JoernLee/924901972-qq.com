import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  // 拿到之前定义的axios实例
  const context = new Axios(config)
  // instance会拥有之前的request方法(此时instance就是request函数)--不影响接口扩展之前的使用--同时也有Axios类中的属性，通过下面操作
  const instance = Axios.prototype.request.bind(context)
  // 把context-Axios实例的原型属性和实例属性全部拷贝到instance上面--得到混合对象
  extend(instance, context)

  // 保证可以找到create方法
  return instance as AxiosStatic
}

const axios = createInstance(defaults)

// 把之前定义的默认配置和用户调create传入的config进行合并
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

// 扩展Cancel相关静态方法
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

export default axios
