import { newFeartureStorageKey } from '@/globalConfig'
import { notification } from 'antd'
import { useEffect } from 'react'

const useNewFeatureInfo = () => {
  useEffect(() => {
    if (localStorage.getItem(newFeartureStorageKey)) return

    localStorage.setItem(newFeartureStorageKey, 'showed')
    notification.info({
      style: { width: 500 },
      message: (
        <div>
          <a target="_blank" href="/manage/markdown">
            仅自己可见功能上线了, 快去体验吧, 点击跳转
          </a>
        </div>
      )
    })
  }, [])
}

export default useNewFeatureInfo
