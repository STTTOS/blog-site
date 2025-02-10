import type { TableColumnProps } from 'antd'
import type { Timeline } from '@/service/timeline/types'
import type { IComponentsConfig } from '@/utils/createForm/types'

import dayjs from 'dayjs'
import { FC, Key } from 'react'
import { Link } from 'react-router-dom'
import { Tag, Input, DatePicker } from 'antd'

import Upload from '@/components/Upload'
import { upload } from '@/service/common'

type StorageKey = 'timeline' | 'article'

interface ReadTagProps {
  type: StorageKey
  id: Key
  updatedAt?: number | string
}
export const ReadTag: FC<ReadTagProps> = ({ type, id, updatedAt }) => {
  const shouldDisplay = isContentHasBeenUpdated(
    type,
    id,
    dayjs(updatedAt).valueOf()
  )

  return shouldDisplay && !!updatedAt ? (
    <Tag style={{ marginLeft: 4 }} color="geekblue">
      有更新
    </Tag>
  ) : null
}
export const recordTimeStampOfViewingContent = (key: StorageKey, id: Key) => {
  localStorage.setItem(`${key}-${id}`, dayjs().valueOf().toString())
}
/**
 *
 * @description 判断对应类别下的内容是否有更新
 * @param storageKey
 * @param id
 */
export const isContentHasBeenUpdated = (
  storageKey: StorageKey,
  id: Key,
  updatedAt: number
) => {
  const unixTimestamp = localStorage.getItem(`${storageKey}-${id}`)

  // 在新设备上不展示此标识
  if (!unixTimestamp) return false

  return updatedAt > Number(unixTimestamp)
}
const columns: TableColumnProps<Timeline>[] = [
  {
    title: '标题',
    dataIndex: 'title',
    render: (_, { id, title, updatedAt }) => {
      return (
        <Link to={`/timeline/${id}`} target="_blank">
          {title}
          <ReadTag type="timeline" id={id} updatedAt={updatedAt} />
        </Link>
      )
    }
  },
  {
    title: '简介',
    dataIndex: 'desc',
    onCell() {
      return {
        style: {
          whiteSpace: 'pre'
        }
      }
    }
  },
  {
    title: '用户',
    render(_, { user: { username, name } }) {
      return name || username
    }
  },
  {
    key: 'createdAt',
    title: '创建时间',
    dataIndex: 'createdAt'
  },
  {
    title: '最近一次更新时间',
    dataIndex: 'updatedAt'
  }
]

const searchBarFields = [
  { label: '标题', name: 'title' },
  {
    name: 'createdAt',
    label: '发布日期',
    placeholder: ['开始日期', '结束日期'],
    element: <DatePicker.RangePicker style={{ width: '100%' }} />
  }
]

const drawerFormComponents: IComponentsConfig = [
  {
    label: '标题',
    name: 'title',
    require: true
  },
  {
    label: '简介',
    name: 'desc',
    element: <Input.TextArea rows={3} />
  },
  {
    label: '背景图',
    name: 'cover',
    require: true,
    element: <Upload request={(file) => upload({ file })} />
  }
]
export { columns, searchBarFields, drawerFormComponents }
