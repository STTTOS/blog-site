import { useRequest } from 'ahooks'
import classNames from 'classnames'
import { Avatar, Popover } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import { FC, useState, ReactNode, useEffect } from 'react'

import { useUserInfo } from '@/model'
import styles from './index.module.less'
import { User } from '@/service/user/types'
import { getUserCard } from '@/service/user'

// 根据Id渲染指定用户的简介
// 如果没有, 则渲染当前用户的
// 对children增加一层外层元素, 绑定hover事件
// 当鼠标悬停时, 展示用户简介
interface UserProfileProps {
  userId?: number
  children?: ReactNode
}
const dataCache = new Map<number, User>()
const UserProfile: FC<UserProfileProps> = ({ userId, children }) => {
  const [open, SetOpen] = useState<boolean>()
  const { user } = useUserInfo()
  const id = userId! || (user?.id as number)

  const { data: userInfo = dataCache.get(id), runAsync } = useRequest(
    getUserCard,
    {
      manual: true
    }
  )
  useEffect(() => {
    if (open && !dataCache.get(id))
      runAsync({ id }).then((data) => dataCache.set(id, data))
  }, [open, id])

  return (
    <Popover
      overlayInnerStyle={{
        padding: 4,
        borderRadius: 12,
        background: 'rgb(135 233 145)'
      }}
      onOpenChange={SetOpen}
      content={
        <div className={classNames(styles.wrapper)}>
          <div
            className={styles.bg}
            style={{
              backgroundImage: userInfo?.backgroundUrl
                ? `url(${userInfo?.backgroundUrl})`
                : undefined
            }}
          ></div>
          <div className={styles.inner}>
            <div className={styles.header}>
              <Avatar
                src={userInfo?.avatar}
                className={styles.avatar}
                size={50}
              />
              <div className={styles.name}>
                {userInfo?.name || userInfo?.username}
              </div>
            </div>

            <div className={styles.content}>
              <em className={styles.desc}>
                {userInfo?.desc || '该用户没有设置个性签名'}
              </em>
            </div>

            {/* 展示git */}
            <div className={styles.footer}>
              {userInfo?.github && (
                <GithubOutlined
                  onClick={() => window.open(userInfo.github)}
                  size={26}
                />
              )}
            </div>
            <div className={styles.top_right}>
              {userInfo?.isContributor && (
                <em className={styles.contributor}>contributor</em>
              )}
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  )
}

export default UserProfile
