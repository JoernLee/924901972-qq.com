import { Canceler, CancelExecutor, CancelTokenSource } from '../types'

// 注意这里的Cancel要去Cancel文件里面去，不要去type文件中去取
// 因为这个Cancel既需要当作值使用，也需要当作类型使用
import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise

    // 内部赋值了函数，这样稍后我们调用resolvePromise就相当于执行了resolve函数，改变pending为resolved状态
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      // this.reason一开始是没值的，只有调用cancel方法才会赋值
      // 如果有值代表调用过，不需要再调用
      if (this.reason) {
        return
      }
      // 这里就需要Cancel当作值去使用
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }

  // 类似工厂方法
  static source(): CancelTokenSource {
    let cancel!:Canceler
    const token = new CancelToken(c=>{
      // 这个就相当于把上面的excutor赋值给cancel，一定有值
      cancel = c
    })
    return {
      // 上面赋值包着一层函数，无法推断，需要手动明确
      cancel,
      token
    }
  }

}
