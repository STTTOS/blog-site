import type { TableColumnProps } from 'antd'

export interface StroageItemProps {
  name: string
  url: string
}
const columns: TableColumnProps<StroageItemProps>[] = [
  {
    title: '序号',
    render: (_, __, index) => index + 1
  },
  {
    title: '名称',
    dataIndex: 'name',
    render(_, { name, url }) {
      return (
        <a target="_blank" href={url}>
          {name}
        </a>
      )
    }
  }
]

export { columns }
