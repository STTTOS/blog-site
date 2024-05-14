import type { TableColumnProps } from 'antd'
import type { Article } from '@/service/article/types'

import { useAntdTable } from 'ahooks'
import { useNavigate } from 'react-router'
import { Form, Space, Button, Popconfirm } from 'antd'

import { useUserInfo } from '@/model'
import styles from './index.module.less'
import SearchBar from '@/components/SearchBar'
import SafeTable from '@/components/SafeTable'
import useGlobalData from '@/hooks/useGlobalData'
import { getColumns, searchBarFields } from './staticModel'
import { getArticles, deleteArticle } from '@/service/article'

const Index = () => {
  const nav = useNavigate()
  const { user } = useUserInfo()
  const [form] = Form.useForm()
  const {
    tableProps,
    search: { submit, reset },
    loading
  } = useAntdTable(getArticles, { form, cacheKey: 'manage/article' })
  const { userOptions, tagOptions } = useGlobalData()

  const deleteArticleFn = async (id: number) => {
    await deleteArticle({ id })
    reset()
  }

  const onAddOrUpdateClick = (id?: number) => {
    const url = id ? `/manage/markdown/${id}` : '/manage/markdown'

    nav(url)
  }

  const canEdit = ({
    coAuthorIds,
    authorId
  }: Pick<Article, 'coAuthorIds' | 'authorId'>) =>
    user &&
    (authorId === user.id ||
      coAuthorIds?.split(',').map(Number).includes(user.id))

  const columns: TableColumnProps<Article>[] = [
    ...getColumns(userOptions),
    {
      title: '操作',
      render: (_, { id, ...article }) => (
        <Space size="middle">
          {canEdit(article) && (
            <>
              <a onClick={() => onAddOrUpdateClick(id)}>Update</a>
              <Popconfirm
                title="删除后将会被放到回收站"
                onConfirm={() => deleteArticleFn(id)}
                okText="Yes"
                cancelText="No"
              >
                <a>Delete</a>
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className={styles.container}>
      <h2>文章管理</h2>
      <div className={styles.search}>
        <SearchBar
          form={form}
          onReset={reset}
          onSearch={submit}
          loading={loading}
          fields={searchBarFields(userOptions, tagOptions)}
        />
      </div>

      <div className={styles['add-btn']}>
        <Button onClick={() => onAddOrUpdateClick()} type="primary">
          添加文章
        </Button>
      </div>

      <SafeTable columns={columns} rowKey="id" {...tableProps} />
    </div>
  )
}

export default Index
