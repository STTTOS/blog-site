import type { SelectProps } from 'rc-select/lib/Select'
import type { IFormItemProps } from '@/utils/createForm/types'

import { Radio, Input, Space, Select, Button } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'

import Upload from '@/components/Upload'
import { upload } from '@/service/common'
import AsyncButton from '@/components/AsyncButton'

const { TextArea } = Input

const modelComponents = (
  userOptions: SelectProps['options'],
  tagOptions: SelectProps['options'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refreshTags: () => Promise<any>
): IFormItemProps[] => {
  return [
    {
      label: '添加标签',
      name: 'tagIds',
      require: true,
      extra: (
        <Space style={{ marginTop: 6 }}>
          <Button
            size="small"
            ghost
            icon={<PlusOutlined />}
            onClick={() => window.open('/manage/tag?open=true')}
          >
            去新增标签
          </Button>
          <AsyncButton
            ghost
            size="small"
            request={refreshTags}
            icon={<ReloadOutlined />}
          />
        </Space>
      ),
      element: (
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select tags"
          options={tagOptions}
          filterOption={(input, option) => {
            return new RegExp(input, 'i').test((option?.label as string) || '')
          }}
        />
      )
    },
    {
      label: '类型',
      name: 'isOrigin',
      initialValue: true,
      element: (
        <Radio.Group>
          <Radio value={true}>原创</Radio>
          <Radio value={false}>转载</Radio>
        </Radio.Group>
      )
    },
    {
      label: '仅自己可见',
      name: 'private',
      initialValue: false,
      element: (
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      )
    },
    {
      label: '编辑摘要',
      name: 'desc',
      element: <TextArea showCount maxLength={100} />
    },
    {
      label: '协同编辑',
      name: 'coAuthorIds',
      placeholder: '选择协同编辑用户',
      element: (
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select authors"
          options={userOptions}
          filterOption={(input, option) => {
            return new RegExp(input, 'i').test((option?.label as string) || '')
          }}
        />
      )
    },
    {
      label: '卡片背景',
      name: 'backgroundUrl',
      element: (
        <Upload uploadText="上传封面" request={(file) => upload({ file })} />
      )
    }
  ]
}

export { modelComponents }
