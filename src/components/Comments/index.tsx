import type { FC } from 'react'
import type { Comment } from '@/service/comments/types'

import styles from './index.module.less'
import { getComments } from '@/service/comments'
import { useRequest } from 'ahooks'
import ReplyItem from '../ReplyItem'
import Reply from '../Reply'

interface CommentsProps {
  articleId: number
  avatar?: string
}
const Comments: FC<CommentsProps> = ({ articleId, avatar }) => {
  const { data, refreshAsync } = useRequest(getComments, {
    defaultParams: [{ articleId }]
  })

  const renderComments = (comments: Comment[]) => {
    if (comments.length === 0)
      return <p className={styles.empty}>暂无评论, 去发一个吧~</p>
    return comments.map((data) => (
      <ReplyItem
        {...data}
        key={data.id}
        articleId={articleId}
        onRelied={refreshAsync}
        selfAvatar={avatar}
      />
    ))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>评论</span>
        <span className={styles.counts}>{data?.total}</span>
      </div>
      <Reply
        articleId={articleId}
        onReplied={refreshAsync}
        className={styles.reply}
        avatar={avatar}
      />
      <div>{renderComments(data?.list || [])}</div>
    </div>
  )
}
export default Comments
