import type { TableColumnProps } from 'antd'
import type { Article } from '@/service/article/types'
import type { IFormItemProps } from '@/utils/createForm/types'

import { FC, useState } from 'react'
import { Tag, Space, Select } from 'antd'
import { SelectProps } from 'rc-select/lib/Select'
import {
  LockFilled,
  EyeOutlined,
  CopyOutlined,
  UnlockOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'

import copy from '@/utils/copy'
import styles from './index.module.less'
import randomTagColor from '@/utils/randomTagColor'

interface TitleProps {
  isPrivate: boolean
  title: string
  id: number
  jumpAble?: boolean
  secure?: boolean
}
const Title: FC<TitleProps> = ({ isPrivate, title, id, jumpAble, secure }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
    >
      <Space className={styles.icon}>
        {isPrivate ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        {secure ? <LockFilled /> : <UnlockOutlined />}
      </Space>
      {jumpAble ? (
        <a href={`/article/${id}`} target="_blank">
          {title}
        </a>
      ) : (
        <span>{title}</span>
      )}
      <CopyOutlined
        style={{ marginLeft: 6, visibility: focused ? 'visible' : 'hidden' }}
        onClick={() => {
          copy(`[${title}](/article/${id})`)
        }}
      />
    </div>
  )
}
const getColumns = (
  userOptions?: SelectProps['options'],
  jumpAble = true
): TableColumnProps<Article>[] => {
  return [
    {
      title: '标题',
      dataIndex: 'title',
      fixed: 'left',
      render: (_, { id, title, private: isPrivate, secure }) => (
        <Title {...{ id, title, isPrivate, secure }} jumpAble={jumpAble} />
      )
    },
    {
      title: '摘要',
      dataIndex: 'desc'
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 300,
      render: (_, { tags }) =>
        tags?.map(({ id, name }) => {
          return (
            <Tag key={id} className={styles.tag} color={randomTagColor()}>
              {name}
            </Tag>
          )
        })
    },
    {
      title: '浏览次数',
      dataIndex: 'viewCount',
      width: 110,
      render: (_, { viewCount }) => viewCount.toLocaleString()
    },
    {
      title: '作者昵称',
      dataIndex: 'authorName'
    },
    {
      title: '可见用户',
      dataIndex: 'coAuthorIds',
      render: (_, { coAuthorIds }) =>
        coAuthorIds
          ?.split(',')
          .map(
            (id) => userOptions?.find(({ value }) => value == Number(id))?.label
          )
          .join(',')
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      width: 200
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 200
    }
  ]
}

const searchBarFields = (
  userOptions: SelectProps['options'],
  tagOptions: SelectProps['options']
): IFormItemProps[] => {
  return [
    { label: '标题', name: 'title' },
    {
      label: '标签',
      name: 'tagIds',
      element: (
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select tags"
          options={tagOptions}
          filterOption={(input, option) => {
            return new RegExp(input, 'i').test((option?.label as string) || '')
          }}
        />
      )
    },
    {
      label: '作者',
      name: 'authorIds',
      element: (
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select authors"
          options={userOptions}
          filterOption={(input, option) => {
            return new RegExp(input, 'i').test((option?.label as string) || '')
          }}
        />
      )
    },
    {
      label: '排序方式',
      name: 'filterType',
      initialValue: 'newest',
      element: (
        <Select
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select filterType"
          options={[
            { label: '最新', value: 'newest' },
            { label: '最热', value: 'hotest' }
          ]}
        />
      )
    }
  ]
}

export { searchBarFields, getColumns }
