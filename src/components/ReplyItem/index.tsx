import { FC, useState } from 'react'
import type { Comment } from '@/service/comments/types'

import styles from './index.module.less'
import { Avatar, Divider } from 'antd'
import SubReply from '../SubReply'
import Reply from '../Reply'

interface ReplyItemProps extends Comment {
  articleId: number;
  onRelied?: () => void;
}
const ReplyItem:FC<ReplyItemProps> = ({ onRelied, content, id, articleId, createdAt, avatar, replies = [], name, isContributor }) => {
  const [showReplay, setShowReply] = useState(false)
  const renderChildrenReplies = (list: Comment[]) => {
    return list.map( data => <SubReply {...data} key={data.id}/>)
  }
  const handleReplyClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation()
    setShowReply(true)
  }
  const handleReplied = () => {
    setShowReply(false)
    onRelied?.()
  }

  return <div className={styles.container}>
    <Avatar src={avatar} className={styles.avatar} size="large"/>
    <div className={styles.main}>
      <div className={styles.header}>
        <span className={styles.name}>{name}</span>
        {isContributor && <em className={styles.contributor}>contributor</em>}
      </div>
      <div className={styles.content}>{content}</div>
      <div className={styles.extra}>
        <span className={styles.time}>{createdAt}</span>
        <span className={styles.reply} onClick={handleReplyClick}>回复</span>
      </div>
      {renderChildrenReplies(replies)}
      {showReplay && <Reply articleId={articleId} parentCommentId={id} placeholder={`@${name}: `} className={styles.replyComponent} onReplied={handleReplied}/>}
      <Divider/>
    </div>
  </div>
}
export default ReplyItem