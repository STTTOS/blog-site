import type { TableColumnProps } from 'antd'

import { useRequest, useAntdTable } from 'ahooks'
import { Form, Space, Button, Popconfirm } from 'antd'

import { useUserInfo } from '@/model'
import styles from './index.module.less'
import SearchBar from '@/components/SearchBar'
import SafeTable from '@/components/SafeTable'
import { Timeline } from '@/service/timeline/types'
import { history } from '@/components/BrowserRouter'
import { searchBarFields, columns as tableColumns } from './staticModel'
import {
  createTimeline,
  deleteTimeline,
  getTimelineList
} from '@/service/timeline'

const Index = () => {
  const [form] = Form.useForm()
  const { user } = useUserInfo()
  const {
    tableProps,
    search: { submit, reset },
    loading
  } = useAntdTable(getTimelineList, { form, cacheKey: '/manage/timeline' })

  const deleteData = async (id: number) => {
    await deleteTimeline({ id })
    reset()
  }
  const handleCreate = () => {
    history.push('/timeline/-1')
  }

  const columns: TableColumnProps<Timeline>[] = [
    ...tableColumns,
    {
      title: '操作',
      width: 140,
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确定删除此时间轴吗?会一并删除所有关联数据"
            onConfirm={() => deleteData(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <a>Delete</a>
          </Popconfirm>
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

      <SafeTable columns={columns} rowKey="id" {...tableProps} />
      {/* {Drawer} */}
    </div>
  )
}

export default Index
