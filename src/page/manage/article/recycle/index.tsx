// 文章回收站
import { useAntdTable } from 'ahooks'
import { Space, Popconfirm, TableColumnProps } from 'antd'

import { getColumns } from '../staticModel'
import SafeTable from '@/components/SafeTable'
import { Article } from '@/service/article/types'
import AsyncButton from '@/components/AsyncButton'
import {
  recoverAritcle,
  getArticleRecycleList,
  deleteAriclePhysically
} from '@/service/article'

const Recycle = () => {
  // const {data, loading} = useRequest(getArticleRecycleList)
  const { tableProps, refresh } = useAntdTable(getArticleRecycleList)
  const handleRecover = async (id: number) => {
    await recoverAritcle({ id })
    refresh()
  }
  const columns: TableColumnProps<Article>[] = [
    ...getColumns([], false).filter(
      ({ dataIndex }) =>
        !['coAuthorIds', 'authorName'].includes(dataIndex as string)
    ),
    {
      title: '操作',
      render: (_, { id }) => (
        <Space size="middle">
          <Popconfirm
            title="删除后将不可找回"
            onConfirm={() => deleteAriclePhysically({ id })}
            okText="Yes"
            cancelText="No"
          >
            <a>delete</a>
          </Popconfirm>
          <AsyncButton type="link" request={() => handleRecover(id)}>
            recover
          </AsyncButton>
        </Space>
      )
    }
  ]
  return (
    <div>
      <SafeTable {...tableProps} columns={columns} />
    </div>
  )
}

export default Recycle
