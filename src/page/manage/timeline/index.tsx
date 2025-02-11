import type { TableColumnProps } from 'antd'

import { useAntdTable } from 'ahooks'
import { Link } from 'react-router-dom'
import { Form, Space, Button, Popconfirm } from 'antd'

import { useUserInfo } from '@/model'
import styles from './index.module.less'
import SearchBar from '@/components/SearchBar'
import SafeTable from '@/components/SafeTable'
import useFormDrawer from '@/hooks/useFormDrawer'
import { Timeline } from '@/service/timeline/types'
import TimelineDrawerContent from './DrawerContent'
import { deleteTimeline, getTimelineList } from '@/service/timeline'
import {
  ReadTag,
  searchBarFields,
  recordTimeStampOfViewingContent
} from './staticModel'

const Index = () => {
  const [form] = Form.useForm()
  const { user } = useUserInfo()
  const { Drawer, openDrawer } = useFormDrawer()
  const {
    tableProps,
    search: { submit, reset },
    loading,
    refresh
  } = useAntdTable(getTimelineList, { form, cacheKey: '/manage/timeline' })

  const deleteData = async (id: number) => {
    await deleteTimeline({ id })
    reset()
  }
  const handleCreate = () => {
    window.open('/timeline/-1')
  }

  const handleUpdate = (data: Timeline) => {
    openDrawer({
      title: '编辑',
      content: <TimelineDrawerContent data={data} />,
      refresh
    })
  }
  const columns: TableColumnProps<Timeline>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (_, { id, title, updatedAt }) => {
        return (
          <Link
            to={`/timeline/${id}`}
            target="_blank"
            onClick={() => {
              recordTimeStampOfViewingContent('timeline', id)
              refresh()
            }}
          >
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
    },
    {
      title: '操作',
      width: 140,
      render: (_, record) => (
        <Space size="middle">
          {record.userId === user?.id && (
            <Popconfirm
              title="确定删除此时间轴吗?会一并删除所有关联数据"
              onConfirm={() => deleteData(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <a>delete</a>
            </Popconfirm>
          )}
          {user?.id === record.userId && (
            <a onClick={() => handleUpdate(record)}>update</a>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className={styles.container}>
      <h2>作者管理</h2>
      <div className={styles.search}>
        <SearchBar
          form={form}
          onReset={reset}
          onSearch={submit}
          loading={loading}
          fields={searchBarFields}
        />
      </div>

      <div className={styles['add-btn']}>
        <Button onClick={handleCreate} type="primary">
          创建时间轴
        </Button>
      </div>

      <SafeTable
        columns={columns}
        rowKey="id"
        showSorterTooltip={{ target: 'sorter-icon' }}
        {...tableProps}
      />
      {Drawer}
    </div>
  )
}

export default Index
