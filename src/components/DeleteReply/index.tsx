import { useRequest } from 'ahooks'
import { Button, message } from 'antd'
import { FC, Key, useCallback } from 'react'

import { useUserInfo } from '@/model'
import { deleteComment } from '@/service/comments'

interface DeleteReplyProps {
  id: Key
  userId: Key
  hasChildren?: boolean
  refresh?: () => void
}
const DeleteReply: FC<DeleteReplyProps> = ({
  id,
  userId,
  refresh,
  hasChildren = false
}) => {
  const { user } = useUserInfo()
  const { loading, runAsync } = useRequest(deleteComment, { manual: true })

  const handleDelete = useCallback(async () => {
    await runAsync({ id, hasChildren })
    refresh?.()
    message.success('删除成功')
  }, [id, hasChildren])

  if (!user || user.id !== userId) return null

  return (
    <Button
      type="text"
      size="small"
      style={{ color: 'red', fontSize: 13 }}
      onClick={handleDelete}
      loading={loading}
    >
      删除
    </Button>
  )
}

export default DeleteReply
