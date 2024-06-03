import type { TableColumnProps } from 'antd'
import type { Timeline } from '@/service/timeline/types'

import { Link } from 'react-router-dom'
import { Input, DatePicker } from 'antd'

import Upload from '@/components/Upload'
import { upload } from '@/service/common'
import { IComponentsConfig } from '@/utils/createForm/types'

const columns: TableColumnProps<Timeline>[] = [
  {
    title: '标题',
    dataIndex: 'title',
    render: (_, { id, title }) => (
      <Link to={`/timeline/${id}`} target="_blank">
        {title}
      </Link>
    )
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
  }
]

const searchBarFields = [
  { label: '标题', name: 'title' },
  {
    name: 'createdAt',
    label: '发布日期',
    placeholder: ['开始日期', '结束日期'],
    element: <DatePicker.RangePicker style={{ width: '100%' }} />
  }
]

// eslint-disable-next-line no-unused-vars
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
export { columns, searchBarFields, drawerFormComponents }
