import React, { FC } from 'react'
import { useRequest } from 'ahooks'
import { Spin, Avatar, Tooltip } from 'antd'

import styles from './index.module.less'
import { visibleUsers } from '@/service/article'

interface AvatarsProps {
  artcileId: number
}
const Avatars: FC<AvatarsProps> = ({ artcileId }) => {
  const { data: list = [], loading } = useRequest(visibleUsers, {
    defaultParams: [{ id: artcileId }]
  })

  if (list.length === 0) return null
  return (
    <Spin spinning={loading}>
      <div className={styles.wrapper}>
        <div className={styles.title}>可见用户</div>
        <Avatar.Group className={styles.avatars}>
          {list.map(({ avatar, name }) => (
            <Tooltip title={name}>
              <Avatar src={avatar} />
            </Tooltip>
          ))}
        </Avatar.Group>
      </div>
    </Spin>
  )
}

export default Avatars
