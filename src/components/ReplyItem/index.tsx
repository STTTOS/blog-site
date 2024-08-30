import type { Comment } from '@/service/comments/types'

import classNames from 'classnames'
import { FC, useState } from 'react'
import { Avatar, Divider } from 'antd'

import Reply from '../Reply'
import SubReply from '../SubReply'
import { useUserInfo } from '@/model'
import styles from './index.module.less'
import DeleteReply from '../DeleteReply'
import UserProfile from '../UserProfile'

interface ReplyItemProps extends Comment {
  articleId: number
  onRefresh?: () => void
  selfAvatar?: string
}
const ReplyItem: FC<ReplyItemProps> = ({
  selfAvatar,
  onRefresh,
  content,
  id,
  articleId,
  createdAt,
  avatar,
  children = [],
  name,
  authorId,
  isContributor
}) => {
  const { user } = useUserInfo()
  const [showReplay, setShowReply] = useState(false)
  const targetId = Number(new URLSearchParams(location.search).get('targetId'))
  const renderChildrenReplies = (list: Comment[]) => {
    return list.map((data) => (
      <SubReply
        {...data}
        key={data.id}
        refresh={onRefresh}
        alert={data.id === targetId}
      />
    ))
  }
  const handleReplyClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation()
    setShowReply(true)
  }
  const handleReplied = () => {
    setShowReply(false)
    onRefresh?.()
  }

  const alertElement = id === targetId

  return (
    <div className={classNames(styles.container)} id={id as string}>
      <UserProfile userId={authorId as number}>
        <Avatar src={avatar} className={styles.avatar} size="large" />
      </UserProfile>
      <div className={styles.main}>
        <div className={styles.header}>
          <UserProfile userId={authorId as number}>
            <span className={styles.name}>{name}</span>
          </UserProfile>
          {isContributor && <em className={styles.contributor}>contributor</em>}
        </div>
        <div
          className={classNames(alertElement && styles.alert, styles.content)}
        >
          {content.message}
        </div>
        <div className={styles.extra}>
          <span className={styles.time}>{createdAt}</span>
          {user?.id && user.id !== authorId && (
            <span className={styles.reply} onClick={handleReplyClick}>
              回复
            </span>
          )}
          <DeleteReply id={id} userId={authorId} refresh={onRefresh} />
        </div>
        {renderChildrenReplies(children)}
        {showReplay && (
          <Reply
            avatar={selfAvatar}
            articleId={articleId}
            parentCommentId={id}
            rootId={id}
            placeholder={`@${name}:  `}
            className={styles.replyComponent}
            onRefresh={handleReplied}
          />
        )}
        <Divider />
      </div>
    </div>
  )
}
export default ReplyItem
