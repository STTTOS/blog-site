import type { IComponentsConfig } from '@/utils/createForm/types'

import dayjs from 'dayjs'
import { FC, Key } from 'react'
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
export { searchBarFields, drawerFormComponents }
