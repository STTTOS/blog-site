import type { TableColumnProps } from 'antd'
import type { Timeline } from '@/service/timeline/types'

import { DatePicker } from 'antd'
import { Link } from 'react-router-dom'

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
    dataIndex: 'desc'
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
// const drawerFormComponents: (type: 'add' | 'edit') => IComponent[] = (type) => {
//   return [
//     {
//       label: '账户',
//       name: 'username',
//       require: true,
//       element: <Input />,
//       range: [6, 16],
//       rules: ['username']
//     },
//     {
//       label: '密码',
//       name: 'password',
//       range: [6, 18],
//       require: type === 'add',
//       element: <Password />
//     },
//     {
//       label: '安全密码',
//       name: 'secureKey',
//       range: [6, 18],
//       element: <Password />
//     },
//     { label: '昵称', name: 'name', require: true },
//     {
//       label: '贡献者',
//       name: 'isContributor',
//       element: <Switch />,
//       valuePropName: 'checked'
//     },
//     {
//       label: '头像',
//       name: 'avatar',
//       element: <Upload request={(file) => upload({ file })} />
//     },
//     {
//       label: '卡片背景',
//       name: 'backgroundUrl',
//       element: <Upload request={(file) => upload({ file })} />
//     },
//     {
//       label: '角色',
//       name: 'role',
//       element: (
//         <Select
//           options={[
//             { label: '管理员', value: 'admin' },
//             { label: '普通用户', value: 'user' }
//           ]}
//         />
//       )
//     },
//     { label: '个人签名', name: 'desc' },
//     { label: '邮箱', name: 'email' },
//     { label: 'github', name: 'github' }
//   ]
// }
export { columns, searchBarFields }
