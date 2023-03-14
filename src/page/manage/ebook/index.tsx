import type { TableColumnProps } from 'antd'
import type { Ebook } from '../../../service/ebook/types'

import { useAntdTable } from 'ahooks'
import SearchBar from '@/components/SearchBar'
import { Form, Button, Space, Popconfirm } from 'antd'

import styles from './index.module.less'
import SafeTable from '@/components/SafeTable'
import EbookDrawerContent from './DrawerContent'
import useFormDrawer from '@/hooks/useFormDrawer'
import { colums, searchBarFields } from './staticModel'
import { getEbooks, deleteEbook } from '@/service/ebook'
import DownloadButton from '../../../components/DownloadButton/index'

const Index = () => {
  const [form] = Form.useForm<Ebook>()
  const { Drawer, openDrawer } = useFormDrawer()
  const {
    tableProps,
    search: { submit, reset },
    loading
  } = useAntdTable(getEbooks, { form })

  const deleteAuthor = async (id: number) => {
    await deleteEbook({ id })
    reset()
  }

  // 新增 or 更新标签
  const onAddOrUpdateClick = (data?: Ebook) => {
    openDrawer({
      width: 500,
      title: data ? '编辑电子书' : '新增电子书',
      content: <EbookDrawerContent data={data} />,
      refresh: reset
    })
  }

  const columns: TableColumnProps<Ebook>[] = [
    ...colums,
    {
      title: '操作',
      width: 300,
      render: (_, record) => (
        <Space size="middle">
          <DownloadButton text="download" url={record.eBookUrl} />
          <a onClick={() => onAddOrUpdateClick(record)}>Update</a>
          <Popconfirm
            title="确定删除吗?"
            onConfirm={() => deleteAuthor(record.id)}
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
      <h2>电子书管理</h2>
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
        <Button onClick={() => onAddOrUpdateClick()} type="primary">
          新增电子书
        </Button>
      </div>

      <SafeTable columns={columns} rowKey="id" {...tableProps} />
      {Drawer}
    </div>
  )
}

export default Index
