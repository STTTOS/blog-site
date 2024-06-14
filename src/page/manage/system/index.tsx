import { useCallback } from 'react'
import { NotificationOutlined } from '@ant-design/icons'

import useAsync from '@/hooks/useAsync'
import styles from './index.module.less'
import { getCountWeb } from '@/service/common'
import useFormDrawer from '@/hooks/useFormDrawer'
import SystemDrawerContent from './DrawerContent'

const Index = () => {
  const { value: viewCount } = useAsync(getCountWeb)
  const { Drawer, openDrawer } = useFormDrawer()

  const addNotify = useCallback(async () => {
    openDrawer({
      title: '推送消息',
      content: <SystemDrawerContent />
    })
  }, [])
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>网站浏览量: {viewCount}</h2>
      <main className={styles.main}>
        <div className={styles.item} onClick={addNotify}>
          <NotificationOutlined className={styles.icon} />
          <span>推送消息</span>
        </div>
      </main>
      {Drawer}
    </div>
  )
}

export default Index
