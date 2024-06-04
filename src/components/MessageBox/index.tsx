import { useRequest } from 'ahooks'
import { useMemo, type FC } from 'react'
import { MessageOutlined } from '@ant-design/icons'
import { List, Badge, Empty, Avatar, Popover } from 'antd'

import request from '@/utils/http'
import { User } from '@/service/user/types'

type MessageType = 'reply' | 'like' | 'comment'
interface Message {
  createdAt: string
  content: string
  id: string
  sender?: User
  type: MessageType
  articleId?: number
}
interface MessageBoxProps {
  // total: number
  // list: Message[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const renderType = (type: MessageType) => {
    if (type === 'reply') return '回复了我的评论'
    else if (type === 'comment') return '评论了我的文章'
  }
  const listContent = useMemo(() => {
    if (list.length === 0) return <Empty />

    return list.map(({ id, createdAt, content, sender, articleId, type }) => {
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
                  {renderType(type)}
                </span>
              </div>
            }
            description={<em>{content}</em>}
          />
          <div>{createdAt}</div>
        </List.Item>
      )
    })
  }, [list])
  return (
    <Popover
      content={
        <List header={<span>消息中心</span>} style={{ width: 600 }}>
          {listContent}
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
