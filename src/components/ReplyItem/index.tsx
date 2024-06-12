import type { Comment } from '@/service/comments/types'

import classNames from 'classnames'
import { FC, useState } from 'react'
import { Avatar, Divider } from 'antd'

import Reply from '../Reply'
import SubReply from '../SubReply'
import styles from './index.module.less'
import DeleteReply from '../DeleteReply'

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
  replies = [],
  name,
  authorId,
  isContributor
}) => {
  const [showReplay, setShowReply] = useState(false)
  const renderChildrenReplies = (list: Comment[]) => {
    return list.map((data) => (
      <SubReply {...data} key={data.id} refresh={onRefresh} />
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

  const elementId = `comment-${id}`
  const alertElement = `#${elementId}` === location.hash

  return (
    <div
      className={classNames(styles.container, alertElement && styles.alert)}
      id={elementId}
    >
      <Avatar src={avatar} className={styles.avatar} size="large" />
      <div className={styles.main}>
        <div className={styles.header}>
          <span className={styles.name}>{name}</span>
          {isContributor && <em className={styles.contributor}>contributor</em>}
        </div>
        <div className={styles.content}>{content}</div>
        <div className={styles.extra}>
          <span className={styles.time}>{createdAt}</span>
          <span className={styles.reply} onClick={handleReplyClick}>
            回复
          </span>
          <DeleteReply
            id={id}
            userId={authorId}
            refresh={onRefresh}
            hasChildren={replies.length > 0}
          />
        </div>
        {renderChildrenReplies(replies)}
        {showReplay && (
          <Reply
            avatar={selfAvatar}
            articleId={articleId}
            parentCommentId={id}
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
