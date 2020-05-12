import { CancelExecutor } from '../types'

interface ResolvePromise {
  (reason?: string): void
}

export default class CancelToken {
  promise: Promise<string>
  reason?: string

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise

    // 内部赋值了函数，这样稍后我们调用resolvePromise就相当于执行了resolve函数，改变pending为resolved状态
    this.promise = new Promise<string>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      // this.reason一开始是没值的，只有调用cancel方法才会赋值
      // 如果有值代表调用过，不需要再调用
      if (this.reason) {
        return
      }
      this.reason = message
      resolvePromise(this.reason)
    })

  }
}
