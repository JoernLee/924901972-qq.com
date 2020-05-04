import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  // 拿到之前定义的axios实例
  const context = new Axios(config)
  // instance会拥有之前的request方法(此时instance就是request函数)--不影响接口扩展之前的使用--同时也有Axios类中的属性，通过下面操作
  const instance = Axios.prototype.request.bind(context)
  // 把context-Axios实例的原型属性和实例属性全部拷贝到instance上面--得到混合对象
  extend(instance, context)

  return instance as AxiosInstance
}

const axios = createInstance(defaults)

export default axios
