import type { FC } from 'react'
import type { Comment } from '@/service/comments/types'

import { Avatar } from 'antd'

import styles from './index.module.less'
import DeleteReply from '../DeleteReply'

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
  }
> = ({
  content,
  avatar,
  name,
  createdAt,
  isContributor,
  id,
  refresh,
  authorId
}) => {
  return (
    <div className={styles.container}>
      <Avatar src={avatar} className={styles.avatar} />
      <div className={styles.main}>
        <div className={styles['user-info']}>
          <span className={styles.name}>{name}</span>
          {isContributor && <em className={styles.contributor}>contributor</em>}
        </div>
        <span className={styles.content}>{content}</span>
        <div className={styles.extra}>
          <span className={styles.time}>{createdAt}</span>
          <DeleteReply id={id} refresh={refresh} userId={authorId} />
        </div>
      </div>
    </div>
  )
}
export default SubReply
