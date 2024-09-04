import type { Comment } from '@/service/comments/types'

import { Avatar } from 'antd'
import classNames from 'classnames'
import { type FC, useState } from 'react'

import Reply from '../Reply'
import { useUserInfo } from '@/model'
import styles from './index.module.less'
import DeleteReply from '../DeleteReply'
import UserProfile from '../UserProfile'
import { User } from '@/service/user/types'
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
    | 'articleId'
    | 'rootId'
    | 'parentUser'
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
  alert,
  articleId,
  rootId,
  parentUser
}) => {
  const [showReply, setShowReply] = useState(false)
  const { user } = useUserInfo()
  const handleReplyClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation()
    setShowReply(true)
  }
  const handleReplied = () => {
    setShowReply(false)
    refresh?.()
  }

  const renderTargetUser = ({
    message,
    at_name_to_id,
    name,
    id
  }: Comment['content'] & Pick<User, 'id' | 'name'>) => {
    if (at_name_to_id) {
      const reg = new RegExp(`@(${Object.keys(at_name_to_id).join('|')})`, 'g')
      const parts = message.split(reg)
      return parts.map((item) => {
        if (at_name_to_id[item] && item === name) {
          return (
            <UserProfile userId={id}>
              <span className={styles.user_can_hover}>@{item}</span>
            </UserProfile>
          )
        }
        return item
      })
    }
    return message
  }
  return (
    <div className={classNames(styles.container)}>
      <UserProfile userId={authorId as number}>
        <Avatar src={avatar} className={styles.avatar} />
      </UserProfile>
      <div className={classNames(alert && wrapperStyles.alert, styles.main)}>
        <span className={styles['user-info']}>
          <UserProfile userId={authorId as number}>
            <span className={styles.name}>{name}</span>
          </UserProfile>
          {isContributor && <em className={styles.contributor}>contributor</em>}
        </span>
        <span className={styles.content} id={id as string}>
          {renderTargetUser({
            ...content,
            name: parentUser?.name,
            id: parentUser?.id as number
          })}
        </span>

        <div className={styles.extra}>
          <span className={styles.time}>{createdAt}</span>
          {user?.id && authorId !== user.id && (
            <span className={styles.reply} onClick={handleReplyClick}>
              回复
            </span>
          )}
          <DeleteReply id={id} refresh={refresh} userId={authorId} />
        </div>
        {showReply && (
          <Reply
            parentUserName={name}
            avatar={user?.avatar}
            rootId={rootId}
            articleId={articleId}
            parentCommentId={id}
            placeholder={`@${name}:  `}
            parentUserId={authorId as number}
            className={styles.replyComponent}
            onRefresh={handleReplied}
          />
        )}
      </div>
    </div>
  )
}
export default SubReply
