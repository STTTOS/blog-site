import type { TableColumnProps } from 'antd'
import type { Tool } from '@/service/tool/types'
import type { IComponentsConfig } from '@/utils/createForm/types'

import Upload from '@/components/Upload'
import { uploadFile } from '@/service/common'

const colums: TableColumnProps<Tool>[] = [
  {
    title: '工具名',
    dataIndex: 'title',
    render: (_, { id, title }) => {
      return (
        <a target="_blank" href={`/tools/${id}`}>
          {title}
        </a>
      )
    }
  }
]

const searchBarFields = [{ label: '工具名', name: 'title' }]

const drawerFormComponents: IComponentsConfig = [
  { label: '工具名', name: 'title' },
  {
    label: 'JS脚本',
    name: 'scriptUrl',
    element: (
      <Upload
        request={(file) => uploadFile({ file })}
        maxCount={1}
        listType="text"
        accept="js"
      />
    )
  },
  {
    label: 'CSS样式文件',
    name: 'cssHref',
    element: (
      <Upload
        request={(file) => uploadFile({ file })}
        maxCount={1}
        listType="text"
        accept="css"
      />
    )
  }
]

export { colums, searchBarFields, drawerFormComponents }
