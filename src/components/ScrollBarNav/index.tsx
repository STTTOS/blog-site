import classnames from 'classnames'
import { ToTopOutlined } from '@ant-design/icons'

import styles from './index.module.less'

function scrollY(to: number) {
  window.scrollTo({ top: to, behavior: 'smooth' })
}
// 上下滚动条
const ScrollBarNav = () => {
  return (
    <div className={styles.wrapper}>
      <div>
        <ToTopOutlined onClick={() => scrollY(0)} className={styles.icon} />
        <ToTopOutlined
          className={classnames(styles.icon, styles.down)}
          onClick={() => scrollY(document.body.scrollHeight)}
        />
      </div>
    </div>
  )
}

export default ScrollBarNav
