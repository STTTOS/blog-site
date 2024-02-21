import { Spin } from 'antd'
import styles from './index.module.less'

function Loading() {
  return (
    <div className={styles.container}>
      <Spin size="large" />
    </div>
  )
}

export default Loading
