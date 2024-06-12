import type { Comment } from '@/service/comments/types'

import { Button } from 'antd'
import { useRequest } from 'ahooks'
import { type FC, useEffect } from 'react'
import { useNavigate } from 'react-router'

import Reply from '../Reply'
import ReplyItem from '../ReplyItem'
import { useUserInfo } from '@/model'
import styles from './index.module.less'
import { getComments } from '@/service/comments'

interface CommentsProps {
  articleId: number
  avatar?: string
}
const Comments: FC<CommentsProps> = ({ articleId, avatar }) => {
  const { user } = useUserInfo()
  const nav = useNavigate()
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

  useEffect(() => {
    if (!data) return

    const targetId = new URLSearchParams(location.search).get('targetId')
    const target = document.getElementById(targetId!)

    if (target) {
      const { top } = target.getBoundingClientRect()
      const scrollTop = document.documentElement.scrollTop
      const offsetTop = top + scrollTop - 100
      window.scrollTo({ top: offsetTop, behavior: 'smooth' })
    }
  }, [data])

  if (!user?.id) {
    return (
      <div className={styles.login_wrapper}>
        <Button
          type="primary"
          color=""
          onClick={() =>
            nav(`/login?from=${encodeURIComponent(location.pathname)}`)
          }
          className={styles.button}
        >
          去登录
        </Button>

        <div className={styles.tips}>登录后可发表评论</div>
      </div>
    )
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
