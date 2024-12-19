import { FC } from 'react'
import { Input } from 'antd'
import { useEventListener } from 'ahooks'
import { EnterOutlined } from '@ant-design/icons'

import styles from './index.module.less'

interface FullscreenSearchProps {
  open: boolean
  onClose: () => void
  // eslint-disable-next-line no-unused-vars
  onSearch: (keyword: string) => void
}
// 悬浮整个屏幕中间的搜索框
const FullscreenSearch: FC<FullscreenSearchProps> = ({
  open,
  onClose,
  onSearch
}) => {
  if (!open) return null

  useEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      onClose()
    }
  })
  return (
    <div className={styles.wrapper} onClick={onClose}>
      <div
        className={styles.search}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <main className={styles.main}>
          <Input.Search
            height={42}
            className={styles.input}
            placeholder="检索关键字"
            onSearch={(value) => {
              onSearch(value)
              onClose()
            }}
          />
          <div className={styles.desc}>键入回车后,将根据关键字筛选结果</div>
        </main>

        <div className={styles.footer}>
          <div className={styles.footer_item}>
            <EnterOutlined className={styles.footer_item_icon} />
            搜索内容
          </div>

          <div className={styles.footer_item}>
            <span>ESC</span>
            关闭搜索框
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullscreenSearch
