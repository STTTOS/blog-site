import type { FC, Key } from 'react'
import type { Comment } from '@/service/comments/types'

import { useRequest } from 'ahooks'
import TextArea from 'antd/lib/input/TextArea'
import { Form, Avatar, Button, message } from 'antd'

import { useUserInfo } from '@/model'
import styles from './index.module.less'
import { addComment } from '@/service/comments'

interface ReplyProps {
  articleId: number
  parentCommentId?: Key
  className?: string
  placeholder?: string
  onRefresh?: () => void
  avatar?: string
}
const Reply: FC<ReplyProps> = ({
  articleId,
  avatar,
  parentCommentId,
  className = '',
  placeholder = '下面我简单喵两句',
  onRefresh
}) => {
  const [form] = Form.useForm()
  const { loading, runAsync } = useRequest(addComment, { manual: true })
  const { user } = useUserInfo()

  const handleSubmit = async ({ content }: Comment) => {
    if (!user) {
      message.warning('先登录再发表评论哦')
      return
    }
    await runAsync({ content, articleId, parentCommentId })
    onRefresh?.()
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
