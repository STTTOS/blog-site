import type { TableColumnProps } from 'antd'
import type { Article } from '@/service/article/types'

import { useNavigate } from 'react-router'
import { useRequest, useAntdTable } from 'ahooks'
import { Form, Space, Button, Switch, Dropdown, Popconfirm } from 'antd'

import { useUserInfo } from '@/model'
import styles from './index.module.less'
import SearchBar from '@/components/SearchBar'
import SafeTable from '@/components/SafeTable'
import useGlobalData from '@/hooks/useGlobalData'
import { getColumns, searchBarFields } from './staticModel'
import {
  getArticles,
  deleteArticle,
  changeAricleVisibility
} from '@/service/article'

export type EditMode = 'normal' | 'secure'
const Index = () => {
  const nav = useNavigate()
  const { user } = useUserInfo()
  const [form] = Form.useForm()
  const {
    tableProps,
    search: { submit, reset },
    loading,
    refresh
  } = useAntdTable(getArticles, { form, cacheKey: 'manage/article' })
  const { userOptions, tagOptions } = useGlobalData()
  const { loading: operating, runAsync } = useRequest(changeAricleVisibility, {
    manual: true
  })
  const deleteArticleFn = async (id: number) => {
    await deleteArticle({ id })
    reset()
  }

  const onAddOrUpdateClick = ({
    id,
    mode
  }: {
    id?: number
    mode: EditMode
  }) => {
    const url = id ? `/manage/markdown/${id}` : '/manage/markdown'

    nav(`${url}?mode=${mode}`)
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
      fixed: 'right',
      title: '是否可见',
      render(_, { id, private: isPrivate, authorId }) {
        return (
          authorId === user?.id && (
            <Switch
              loading={operating}
              checkedChildren="是"
              unCheckedChildren="否"
              checked={!isPrivate}
              onChange={async (checked) => {
                await runAsync({ id, isPrivate: !checked })
                refresh()
              }}
            />
          )
        )
      }
    },
    {
      title: '操作',
      render: (_, { id, secure, ...article }) => (
        <Space size="middle">
          {canEdit(article) && (
            <>
              <a
                onClick={() =>
                  onAddOrUpdateClick({
                    id,
                    mode: secure ? 'secure' : 'normal'
                  })
                }
              >
                Update
              </a>
              <Popconfirm
                title="删除后将会被放到回收站, 30天后自动删除"
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
        <Dropdown
          placement="bottom"
          menu={{
            items: [
              {
                key: '1',
                label: (
                  <Button
                    onClick={() => onAddOrUpdateClick({ mode: 'secure' })}
                  >
                    安全模式
                  </Button>
                )
              },
              {
                key: '2',
                label: (
                  <Button
                    onClick={() => onAddOrUpdateClick({ mode: 'normal' })}
                  >
                    普通模式
                  </Button>
                )
              }
            ]
          }}
        >
          <Button type="primary">添加文章</Button>
        </Dropdown>
      </div>

      <SafeTable columns={columns} rowKey="id" {...tableProps} />
    </div>
  )
}

export default Index
