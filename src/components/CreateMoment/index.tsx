import { FC } from 'react'
import classNames from 'classnames'
import { InstagramOutlined } from '@ant-design/icons'

import styles from './index.module.less'

const CreateMoment: FC<{
  onClick: () => void
  className?: string
}> = ({ onClick, className }) => {
  return (
    <div className={classNames(styles.add_moment, className)}>
      <InstagramOutlined className={styles.icon} onClick={onClick} />
    </div>
  )
}

export default CreateMoment
