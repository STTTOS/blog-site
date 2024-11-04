import type { FC } from 'react'

import styles from './index.module.less'

const LoadingBar: FC<{ detail?: boolean }> = ({ detail }) => {
  return (
    <div
      className={styles.bar}
      style={{ width: detail ? '100%' : undefined }}
    />
  )
}

export default LoadingBar
