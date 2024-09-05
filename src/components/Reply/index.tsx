import type { FC, Key } from 'react'
import type { MessageContent } from '@/service/comments/types'

import { useRequest } from 'ahooks'
import { Form, Input, Avatar, Button, message } from 'antd'

import { useUserInfo } from '@/model'
import styles from './index.module.less'
import { addComment } from '@/service/comments'

const { TextArea } = Input
interface ReplyProps {
  articleId: number
  parentCommentId?: Key
  rootId?: Key
  className?: string
  placeholder?: string
  onRefresh?: () => void
  avatar?: string
  parentUserName?: string
  parentUserId?: number
}

const Reply: FC<ReplyProps> = ({
  articleId,
  avatar,
  rootId,
  parentCommentId,
  parentUserId,
  className = '',
  placeholder = '下面我简单喵两句',
  parentUserName = '',
  onRefresh
}) => {
  const [form] = Form.useForm()
  const { loading, runAsync } = useRequest(addComment, { manual: true })
  const { user } = useUserInfo()

  const handleSubmit = async ({ content: input }: { content: string }) => {
    if (!user) {
      message.warning('先登录再发表评论哦')
      return
    }
    const content: MessageContent = {
      message: input
    }
    if (parentUserName && parentUserId) {
      content.at_name_to_id = {
        [parentUserName]: parentUserId
      }
    }
    await runAsync({
      articleId,
      rootId,
      parentCommentId,
      content
    })
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
