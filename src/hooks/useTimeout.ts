import { useRef, useEffect, useCallback } from 'react'

/**
 * @description 封装计时器, 在跳转页面时销毁
 * @param callback 回调函数
 * @param ms 倒计时时间
 */
function useTimeout(
  // eslint-disable-next-line no-unused-vars
  callback: (...args: unknown[]) => unknown,
  /**单位: 毫秒 */
  ms: number,
  /**是否手动开启计数 */
  manual = false
) {
  const ref = useRef<NodeJS.Timeout>()

  const start = useCallback(() => {
    clearTimeout(ref.current)
    ref.current = setTimeout(callback, ms)
  }, [ms, ref, callback])

  useEffect(() => {
    if (manual) return

    start()
    return () => clearTimeout(ref.current)
  }, [])

  return {
    start,
    abort() {
      clearTimeout(ref.current)
    }
  }
}

export default useTimeout
