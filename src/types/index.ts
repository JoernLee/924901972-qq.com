/** 公共类型定义  */

// 使用字符串字面量定义类型
export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  // 定义一个响应数据类型
  responseType?: XMLHttpRequestResponseType
  // 定义超时时间
  timeout?: number
  // 配置函数
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]

  // 取消
  cancelToken?: CancelToken

  // 字符串索引签名
  [propName: string]: any
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

// 定义Axios函数返回类型,现在需要返回一个promise对象
export interface AxiosPromise<T = any> extends Promise<AxiosResponse> {
}

export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

export interface Axios {
  defaults: AxiosRequestConfig

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  // 允许请求传入一个期望拿到的类型
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  // 这里是定义了混合对象，简单来说你既可以把AxiosInstance当函数使用，也可以使用里面的属性方法
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 定义一个静态接口-定义了函数字段
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  // 扩展静态属性
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
}

export interface AxiosInterceptorManager<T> {
  // 返回的ID用于标志和删除
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

// 函数接口,返回可以是泛型或者Promise对象
export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

// 函数接口，返回错误可能是任何类型
export interface RejectedFn {
  (error: any): any
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

export interface CancelToken {
  promise: Promise<Cancel>
  // promise result中的参数
  reason?: Cancel

  // 额外的逻辑
  throwIfRequested(): void
}

// 取消方法的接口
export interface Canceler {
  (message?: string): void
}

// 传给Token的构造函数参数类型
export interface CancelExecutor {
  (cancel: Canceler): void
}

// 静态接口相关
export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

// 这个是CancelToken类的类型
// 上面的CancelToken是类的实例类型
export interface CancelTokenStatic {
  // 构造函数类型
  new(executor: CancelExecutor): CancelToken

  // source方法的返回
  source(): CancelTokenSource

}

// Cancel类的实例类型
export interface Cancel {
  message?: string
}

// 类类型
export interface CancelStatic {
  new(message?: string): Cancel
}
