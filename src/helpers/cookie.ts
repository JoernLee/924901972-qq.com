const cookie = {
  read(name: string): string | null {
    // 正则,开头是^，后面是cookie的name，后面括号是为了捕获值(3)
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return match ? decodeURI(match[3]) : null
  }
}
// 方便后面扩展
export default cookie
