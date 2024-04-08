import type { FC } from 'react'
import type { Comment } from '@/service/comments/types'

import { useRequest } from 'ahooks'

import Reply from '../Reply'
import ReplyItem from '../ReplyItem'
import styles from './index.module.less'
import { getComments } from '@/service/comments'

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
        onRefresh={refreshAsync}
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
        onRefresh={refreshAsync}
        className={styles.reply}
        avatar={avatar}
      />
      <div>{renderComments(data?.list || [])}</div>
    </div>
  )
}
export default Comments
