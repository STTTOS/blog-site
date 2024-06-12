import qs from 'qs'
import dayjs from 'dayjs'
import { useRequest } from 'ahooks'
import { MessageOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useMemo, type FC, useState, useEffect } from 'react'
import { List, Badge, Empty, Avatar, Button, Popover } from 'antd'

import request from '@/utils/http'
import styles from './index.module.less'
import { User } from '@/service/user/types'

type MessageType = 'reply' | 'like' | 'comment'
interface Message {
  createdAt: string
  content: string
  id: string
  sender?: User
  type: MessageType
  articleId?: number
  isRead: boolean
  extra: {
    articleId?: number
    commentId?: number
  }
}
interface MessageBoxProps {
  [key: string]: any
}

const readableDateStr = (time: string) => {
  const date = dayjs(time)
  const currentDate = dayjs()

  const days = currentDate.diff(date, 'days')
  if (days > 3) {
    // 如果不是当年的, 则展示年份
    if (currentDate.get('year') !== date.get('year')) {
      return date.format('YYYY-MM-DD')
    }
    // 如果超过3天, 则展示月份/天
    return date.format('MM-DD')
  }

  // 如果是3天内, 直接调用fromNow
  return date.fromNow()
}
const pageSize = 10
// 消息盒子
const MessageBox: FC<MessageBoxProps> = () => {
  const [list, setList] = useState<Message[]>([])
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(0)
  const { runAsync, loading } = useRequest(
    (page = 1) =>
      request<{ list: Message[]; total: number }>('api/message/list', {
        pageSize,
        current: page
      }).then((res) => res.data),
    { manual: true }
  )
  const { data, refreshAsync: refreshCount } = useRequest(() =>
    request<{ count: number }>('api/message/unreadCount').then(
      (props) => props.data
    )
  )
  const { runAsync: readAll, loading: reading } = useRequest(
    () => request<{ count: number }>('api/message/readAll'),
    { manual: true }
  )

  const loadMore = async () => {
    if (loading) return

    const res = await runAsync(current + 1)
    setList(list.concat(res.list))
    setTotal(res.total)
    setCurrent((pre) => pre + 1)
  }
  const renderType = (type: MessageType) => {
    if (type === 'reply') return '回复了我的评论'
    else if (type === 'comment') return '评论了我的文章'
  }
  const listContent = useMemo(() => {
    return list.map(
      ({
        id,
        createdAt,
        content,
        sender,
        type,
        isRead,
        extra: { articleId, commentId }
      }) => {
        return (
          <List.Item
            key={id}
            style={{ cursor: 'pointer', gap: '20px', position: 'relative' }}
            onClick={async (e) => {
              e.stopPropagation()

              await request('api/message/read', { id }).then(() => {
                setList(
                  list.map((props) => {
                    if (props.id === id) {
                      return { ...props, isRead: true }
                    }
                    return props
                  })
                )
              })
              refreshCount()
              const query = qs.stringify({
                targetId: commentId
              })
              articleId && window.open(`/article/${articleId}?${query}`)
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
            <div>{readableDateStr(createdAt)}</div>
            {!isRead && <div className={styles.unRead}></div>}
          </List.Item>
        )
      }
    )
  }, [list])

  const handleReadAll = async () => {
    await readAll()
    await refreshCount()
    setList(list.map((props) => ({ ...props, isRead: true })))
  }
  const hasMore = useMemo(() => {
    return list.length < total
  }, [list, total])

  const showReadAll = useMemo(() => {
    return list.filter((props) => !props.isRead).length > 0
  }, [list])

  useEffect(() => {
    loadMore()
  }, [])
  return (
    <Popover
      content={
        <List
          header={
            <div className={styles.header}>
              <span>消息中心</span>
              {showReadAll && (
                <Button type="link" onClick={handleReadAll} loading={reading}>
                  全部标记已读
                </Button>
              )}
            </div>
          }
          style={{ width: 600 }}
        >
          {list.length === 0 ? (
            <Empty />
          ) : (
            <InfiniteScroll
              height={600}
              next={loadMore}
              hasMore={hasMore}
              dataLength={list.length}
              loader={<div className={styles.loading}>Loading ...</div>}
            >
              {listContent}
            </InfiniteScroll>
          )}
        </List>
      }
    >
      <Badge count={data?.count || 0}>
        <MessageOutlined style={{ fontSize: 20, fontWeight: 'bold' }} />
      </Badge>
    </Popover>
  )
}

export default MessageBox
