import dayjs from 'dayjs'
import { prop } from 'ramda'
import { useRequest } from 'ahooks'
import classNames from 'classnames'
import { MoreOutlined } from '@ant-design/icons'
import { FC, useMemo, useState, useEffect } from 'react'
import { LikeFilled, LikeOutlined } from '@ant-design/icons'
import {
  Space,
  Button,
  Avatar,
  Divider,
  message,
  Dropdown,
  DatePicker
} from 'antd'

import Gallery from '../Gallery'
import { useUserInfo } from '@/model'
import styles from './index.module.less'
import AsyncButton from '../AsyncButton'
import UserProfile from '../UserProfile'
import { User } from '@/service/user/types'
import { Editor, Viewer } from '../Markdown'
import DateDisplay from '@/components/DateDisplay'
import { MomentImage, Moment as MomentType } from '@/service/timeline/types'
import {
  addMoment,
  likeMoment,
  deleteMoment,
  updateMoment
} from '@/service/timeline'

export type EditMode = 'edit' | 'view'
type MomentProps = {
  // eslint-disable-next-line no-unused-vars
  onDelete?: (id: number) => void
  mode?: EditMode
  onCancel: () => void
  onSave: () => void
  hideDate?: boolean
  userId?: number
  likes?: Partial<User>[]
} & Partial<MomentType>
const Moment: FC<MomentProps> = ({
  id,
  content,
  createdAt,
  onDelete,
  images,
  mode: defaultMode = 'view',
  timelineId,
  onCancel,
  onSave,
  hideDate,
  userId,
  likes: _likes
}) => {
  const isAdd = !id
  const { user } = useUserInfo()
  const [likes, setLikes] = useState(_likes)
  const [timePicked, setTimePicked] = useState(dayjs().toISOString())
  const [draft, setDraft] = useState<string>('')
  const [mode, setMode] = useState<EditMode>(defaultMode)
  const [imgSet, setImageSet] = useState<MomentImage[]>([])
  const { runAsync: save, loading } = useRequest(updateMoment, { manual: true })
  const { runAsync: add, loading: adding } = useRequest(addMoment, {
    manual: true
  })
  const { runAsync: remove, loading: deleting } = useRequest(deleteMoment, {
    manual: true
  })

  const canEdit = useMemo(() => {
    return user?.id === userId
  }, [user, userId])

  const handleSave = async () => {
    if (imgSet.length === 0 && !draft) {
      message.error('内容不可为空')
      return
    }
    if (isAdd) {
      await add({
        content: draft,
        images: imgSet,
        timelineId,
        createdAt: timePicked
      })
    } else {
      await save({
        id,
        content: draft,
        images: imgSet
      })
    }
    onSave()
    setMode('view')
  }

  const handleDelete = async () => {
    await remove({ id: id! })
    onDelete!(id!)
  }
  const handleCancel = async () => {
    if (isAdd) {
      onCancel()
      return
    }
    setDraft(content || '')
    setMode('view')
    setImageSet(images || [])
    onCancel()
  }
  useEffect(() => {
    if (content) setDraft(content)
  }, [content])

  useEffect(() => {
    setImageSet(images || [])
  }, [images])

  const items = useMemo(() => {
    if (!user?.id) return []

    const operationsOfOwner = [
      {
        label: (
          <Button
            type="text"
            style={{ padding: 0, width: 60 }}
            onClick={() => setMode('edit')}
          >
            编辑
          </Button>
        ),
        key: '1'
      },
      {
        label: (
          <Button
            type="text"
            style={{ padding: 0, width: 60 }}
            onClick={handleDelete}
            loading={deleting}
          >
            删除
          </Button>
        ),
        key: '2'
      }
    ]
    const [icon, action] = (function getIconAndAction() {
      if (user?.id && likes?.map((item) => item.id).includes(user.id)) {
        return [<LikeFilled />, async () => void 0]
      }
      return [
        <LikeOutlined />,
        () =>
          likeMoment({ id, timelineId }).then(() =>
            setLikes((pre) => [
              { id: user?.id, avatar: user?.avatar },
              ...(pre || [])
            ])
          )
      ]
    })()
    const operationsOfOthers = [
      {
        label: (
          <AsyncButton
            style={{ padding: 0, width: 60 }}
            icon={icon}
            request={action}
          ></AsyncButton>
        ),
        key: '3'
      }
    ]

    if (canEdit) return operationsOfOwner.concat(operationsOfOthers)
    return operationsOfOthers
  }, [canEdit, deleting, handleDelete, id, timelineId, likes, user])
  const dateElement = useMemo(() => {
    if (isAdd)
      return (
        <DatePicker
          style={{ height: 40, width: 120 }}
          size="small"
          placeholder="日期"
          defaultValue={dayjs()}
          onChange={(date) => setTimePicked(date.toISOString())}
        />
      )

    if (hideDate) return null

    return <DateDisplay date={createdAt} className={styles.date} />
  }, [hideDate, isAdd])

  const likeUsers = useMemo(() => {
    if (!likes || likes.length === 0) return null

    const users = likes.map((user) => (
      <UserProfile userId={user.id}>
        <Avatar src={user.avatar} />
      </UserProfile>
    ))
    return (
      <div className={styles.likes}>
        <LikeFilled className={styles.likes_icon} />
        {users}
      </div>
    )
  }, [likes])
  return (
    <div className={styles.wrapper}>
      <div className={styles.extra}>
        <span className={styles.time}>
          {createdAt && dayjs(createdAt).format('HH:mm')}
        </span>

        {!isAdd && (
          <Dropdown
            menu={{
              items
            }}
          >
            <MoreOutlined className={styles.more} />
          </Dropdown>
        )}
      </div>

      <div style={{ minWidth: 96, flexShrink: 0 }}>{dateElement}</div>
      <main className={classNames(styles.main, hideDate && styles.divider)}>
        {mode === 'edit' && (
          <Space className={styles.op}>
            <Button
              type="link"
              onClick={handleSave}
              loading={loading || adding}
            >
              {isAdd ? '发布' : '保存'}
            </Button>
            <Button type="text" onClick={handleCancel}>
              取消
            </Button>
          </Space>
        )}

        {mode === 'edit' ? (
          <Editor value={draft} onChange={setDraft} style={{ height: 400 }} />
        ) : (
          <Viewer
            value={draft}
            className={styles.viewer}
            style={{ padding: 0 }}
          />
        )}

        {mode === 'edit' && <Divider />}

        <Gallery
          mode={mode}
          onDelete={(url) =>
            setImageSet((list) => list.filter((item) => item.src !== url))
          }
          momentId={id}
          onChange={(url) => {
            setImageSet((list) => {
              const newSort = (() => {
                if (list.length === 0) return 1
                return Math.max(...list.map(prop('sort'))) + 1
              })()
              return list.concat({ src: url, sort: newSort })
            })
          }}
          images={[...imgSet].sort((a, b) => a.sort - b.sort)}
        />
        <Divider />
        {likeUsers}
      </main>
    </div>
  )
}

export default Moment
