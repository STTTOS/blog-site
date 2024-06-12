import type { FC } from 'react'
import type { Comment } from '@/service/comments/types'

import { Avatar } from 'antd'
import classNames from 'classnames'

import styles from './index.module.less'
import DeleteReply from '../DeleteReply'
import wrapperStyles from '@/components/ReplyItem/index.module.less'

const SubReply: FC<
  Pick<
    Comment,
    | 'id'
    | 'avatar'
    | 'content'
    | 'createdAt'
    | 'isContributor'
    | 'name'
    | 'authorId'
  > & {
    refresh?: () => void
    alert?: boolean
  }
> = ({
  content,
  avatar,
  name,
  createdAt,
  isContributor,
  id,
  refresh,
  authorId,
  alert
}) => {
  return (
    <div className={classNames(styles.container)}>
      <Avatar src={avatar} className={styles.avatar} />
      <div className={styles.main}>
        <div className={styles['user-info']}>
          <span className={styles.name}>{name}</span>
          {isContributor && <em className={styles.contributor}>contributor</em>}
        </div>
        <div
          className={classNames(alert && wrapperStyles.alert, styles.content)}
          id={id as string}
        >
          {content}
        </div>
        <div className={styles.extra}>
          <span className={styles.time}>{createdAt}</span>
          <DeleteReply id={id} refresh={refresh} userId={authorId} />
        </div>
      </div>
    </div>
  )
}
export default SubReply
