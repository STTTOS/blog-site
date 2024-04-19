import type { TableColumnProps } from 'antd'
import type { User } from '@/service/user/types'

import { useMemo } from 'react'
import { useAntdTable } from 'ahooks'
import { Form, Space, Button, Popconfirm } from 'antd'

import { useUserInfo } from '@/model'
import styles from './index.module.less'
import SearchBar from '@/components/SearchBar'
import SafeTable from '@/components/SafeTable'
import useFormDrawer from '@/hooks/useFormDrawer'
import AuthorDrawerContent from './DrawerContent'
import { getUsers, deleteUser } from '@/service/user'
import { colums, searchBarFields } from './staticModel'

const Index = () => {
  const [form] = Form.useForm()
  const { user } = useUserInfo()
  const { Drawer, openDrawer } = useFormDrawer()
  const {
    tableProps,
    search: { submit, reset },
    loading
  } = useAntdTable(getUsers, { form })

  const deleteAuthor = async (id: number) => {
    await deleteUser({ id })
    reset()
  }

  // 新增 or 更新作者
  const onAddOrUpdateClick = (data?: User) => {
    openDrawer({
      width: 500,
      title: data ? '更新作者' : '添加作者',
      content: <AuthorDrawerContent data={data} />,
      refresh: reset
    })
  }
  const hasAuth = useMemo(() => {
    return user?.role === 'admin'
  }, [user])
  const columns: TableColumnProps<User>[] = [
    ...colums,
    {
      title: '操作',
      width: 140,
      render: (_, record) => (
        <Space size="middle">
          {user?.id === record.id && (
            <a onClick={() => onAddOrUpdateClick(record)}>Update</a>
          )}

          {hasAuth && (
            <Popconfirm
              title="确定删除这个作者吗?"
              onConfirm={() => deleteAuthor(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <a>Delete</a>
            </Popconfirm>
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
        <Button onClick={() => onAddOrUpdateClick()} type="primary">
          添加作者
        </Button>
      </div>

      <SafeTable columns={columns} rowKey="id" {...tableProps} />
      {Drawer}
    </div>
  )
}

export default Index
