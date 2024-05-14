import type { MenuProps } from 'antd'

import {
  TagsOutlined,
  UserOutlined,
  ToolOutlined,
  BookOutlined,
  SettingOutlined,
  FileWordOutlined,
  FileTextOutlined
} from '@ant-design/icons'

type MenuItem = Required<MenuProps>['items'][number]

const menuItems: MenuItem[] = [
  {
    key: 'author',
    label: '作者管理',
    icon: <UserOutlined />
  },
  {
    key: 'tag',
    label: '标签管理',
    icon: <TagsOutlined />
  },
  {
    key: 'article',
    label: '文章管理',
    icon: <FileWordOutlined />,
    children: [
      { key: 'article/list', label: '列表' },
      { key: 'article/recycle', label: '回收站' }
    ]
  },
  {
    key: 'tool',
    label: '工具管理',
    icon: <ToolOutlined />
  },
  {
    key: 'ebook',
    label: '电子书管理',
    icon: <BookOutlined />
  },
  {
    key: 'system',
    label: '系统管理',
    icon: <SettingOutlined />
  },
  {
    key: 'storage',
    label: '文件存储',
    icon: <FileTextOutlined />
  }
]

export default menuItems
