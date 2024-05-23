import { useRef, useState, useEffect } from 'react'

import { revalidateTime } from '@/config'
import { useGoAuth, sessionSecurekey } from '@/page/auth'

// 在离开页面时, 开始计时, 如果超过30s, 则隐藏内容, 跳转到鉴权页面
export const useHideContent = (hide = false) => {
  const ref = useRef<NodeJS.Timeout>()
  const [shouldHide, setShouldHide] = useState(false)

  const { goAuth } = useGoAuth()
  const start = () => {
    ref.current = setTimeout(() => {
      setShouldHide(true)
      sessionStorage.removeItem(sessionSecurekey)
    }, revalidateTime * 1000)
  }
  const reset = () => {
    if (ref.current) clearTimeout(ref.current)
  }
  useEffect(() => {
    if (!hide) return

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        reset()
      } else {
        start()
      }
    }
    window.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      window.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [hide])

  useEffect(() => {
    if (shouldHide) {
      goAuth()
    }
  }, [shouldHide, goAuth])
}
