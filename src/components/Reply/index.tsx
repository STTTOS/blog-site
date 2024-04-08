import type { FC } from 'react'
import type { Comment } from '@/service/comments/types'

import styles from './index.module.less'
import { Avatar, Button, Form, message } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { addComment } from '@/service/comments'
import { useRequest } from 'ahooks'
import { useUserInfo } from '@/model'

interface ReplyProps {
  articleId: number
  parentCommentId?: number
  className?: string
  placeholder?: string
  onReplied?: () => void
  avatar?: string
}
const Reply: FC<ReplyProps> = ({
  articleId,
  avatar,
  parentCommentId,
  className = '',
  placeholder = '下面我简单喵两句',
  onReplied
}) => {
  const [form] = Form.useForm()
  const { loading, runAsync } = useRequest(addComment, { manual: true })
  const { user } = useUserInfo()

  const handleSubmit = async ({ content }: Comment) => {
    if (!user) {
      message.warn('先登录再发表评论哦')
      return
    }
    await runAsync({ content, articleId, parentCommentId })
    onReplied?.()
    form.resetFields()
  }

  return (
    <div className={[styles.reply, className].join(' ')}>
      <Avatar src={avatar} className={styles.avatar} />
      <Form className={styles.form} onFinish={handleSubmit} form={form}>
        <Form.Item name="content" noStyle>
          <TextArea
            className={styles.content}
            required
            placeholder={placeholder}
            maxLength={1000}
            allowClear
          />
        </Form.Item>
        <Button
          type="primary"
          className={styles.submit}
          htmlType="submit"
          loading={loading}
        >
          发布
        </Button>
      </Form>
    </div>
  )
}
export default Reply
