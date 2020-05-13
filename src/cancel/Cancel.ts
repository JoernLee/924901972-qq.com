// Cancel类型错误--一种错误类型
export default class Cancel {
  message?:string

  constructor(message?:string) {
    this.message = message
  }
}

// 判断是不是Cancel实例
export function isCancel(value: any): boolean {
  return value instanceof Cancel
}
