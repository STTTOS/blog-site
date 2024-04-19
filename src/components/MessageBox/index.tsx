import type { FC } from 'react'

import { useRequest } from 'ahooks'
import { List, Badge, Avatar, Popover } from 'antd'
import { MessageOutlined } from '@ant-design/icons'

import request from '@/utils/http'
import { User } from '@/service/user/types'

interface Message {
  createdAt: string
  content: string
  id: string
  sender?: User
  type: 'reply' | 'like'
  articleId?: number
}
interface MessageBoxProps {
  // total: number
  // list: Message[]
  [key: string]: any
}
// 消息盒子
const MessageBox: FC<MessageBoxProps> = () => {
  const { data, mutate } = useRequest(() =>
    request<{ list: Message[]; total: number }>('api/message/unread').then(
      (res) => res.data
    )
  )
  const { total = 0, list = [] } = data || {}

  return (
    <Popover
      content={
        <List header={<span>消息中心</span>} style={{ width: 600 }}>
          {list.map(({ id, createdAt, content, sender, articleId }) => {
            return (
              <List.Item
                key={id}
                style={{ cursor: 'pointer', gap: '20px' }}
                onClick={async (e) => {
                  e.stopPropagation()

                  request('api/message/read', { id }).then(() => {
                    mutate({
                      list: list.filter((item) => item.id !== id),
                      total: Math.max(total - 1, 0)
                    })
                  })
                  articleId && window.open(`/article/${articleId}`)
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar src={sender?.avatar} />}
                  title={
                    <div style={{ display: 'flex' }}>
                      <em style={{ whiteSpace: 'nowrap' }}>{sender?.name}</em>
                      <span style={{ marginLeft: 4, fontWeight: 'normal' }}>
                        回复了我的评论:
                      </span>
                    </div>
                  }
                  description={<em>{content}</em>}
                />
                <div>{createdAt}</div>
              </List.Item>
            )
          })}
        </List>
      }
    >
      <Badge count={total}>
        <MessageOutlined style={{ fontSize: 20, fontWeight: 'bold' }} />
      </Badge>
    </Popover>
  )
}

export default MessageBox
