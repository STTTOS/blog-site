import type { TableColumnProps } from 'antd'
import type { Ebook } from '../../../service/ebook/types'
import type {
  IFormItemProps,
  IComponentsConfig
} from '@/utils/createForm/types'

import { Select, Tooltip, InputNumber } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

import Upload from '@/components/Upload'
import { uploadFile } from '@/service/common'
import { ebookMap, ebookOptions } from './constants'
import { supportedPreviewFile } from '@/globalConfig'
import { getFileType } from '@/components/Upload/methods'

const colums: TableColumnProps<Ebook>[] = [
  {
    title: (
      <div>
        <span>电子书名称</span>
        <Tooltip title="pdf格式可直接在浏览器中预览">
          <QuestionCircleOutlined style={{ marginLeft: 4 }} />
        </Tooltip>
      </div>
    ),
    dataIndex: 'name',
    render: (_, { eBookUrl, name }) => (
      <em>
        {supportedPreviewFile.includes(getFileType(eBookUrl)) ? (
          <a target="_blank" href={eBookUrl}>
            {name}
          </a>
        ) : (
          name
        )}
      </em>
    )
  },
  {
    title: '电子书分类',
    dataIndex: 'category',
    render: (_, { category }) => ebookMap.get(category)
  },
  {
    title: '上传时间',
    dataIndex: 'createdAt'
  },
  {
    title: '上传用户',
    dataIndex: 'createdBy'
  },
  {
    title: '字数(千字)',
    dataIndex: 'words'
  }
]

const searchBarFields: IFormItemProps<Ebook>[] = [
  { label: '电子书名称', name: 'name' },
  {
    label: '分类',
    name: 'category',
    placeholder: '选择分类',
    element: <Select allowClear mode="multiple" options={ebookOptions} />
  }
]

const drawerFormComponents: IComponentsConfig = [
  { label: '电子书名称', name: 'name' },
  {
    label: '电子书分类',
    name: 'category',
    initialValue: 'other',
    element: <Select options={ebookOptions} allowClear />
  },
  {
    label: '字数(千字)',
    name: 'words',
    require: false,
    element: <InputNumber />
  },
  {
    label: '文件',
    name: 'eBookUrl',
    extra: '支持pdf, epub格式',
    element: (
      <Upload
        listType="text"
        accept="epub,pdf"
        request={(file) => uploadFile({ file })}
      />
    )
  }
]

export { colums, searchBarFields, drawerFormComponents }
