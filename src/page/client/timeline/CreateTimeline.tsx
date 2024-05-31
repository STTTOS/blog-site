import Box from '@mui/joy/Box'
import Input from '@mui/joy/Input'
import { Form, Drawer } from 'antd'
import Textarea from '@mui/joy/Textarea'
import { FC, ComponentType } from 'react'

import Upload from '@/components/Upload'
import { upload } from '@/service/common'
import { defaultTimelineCover } from '@/config'
import AsyncButton from '@/components/AsyncButton'
import { Timeline } from '@/service/timeline/types'

export type CreateTimelineFormProps = Pick<Timeline, 'cover' | 'desc' | 'title'>
type CreateTimelineProps = {
  // eslint-disable-next-line no-unused-vars
  onCreate: (values: CreateTimelineFormProps) => Promise<void>
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any, no-unused-vars
function withAdaptAntdFormItem<P>(Component: ComponentType<P>) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore dont't know
  return ({ onChange, ...props }: P) => (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore dont't know
    <Component
      {...props}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={(e: any) => {
        onChange(e.target.value)
      }}
    />
  )
}
const AntdFormInput = withAdaptAntdFormItem(Input)
const AntdFormTextarea = withAdaptAntdFormItem(Textarea)
const CreateTimeline: FC<CreateTimelineProps> = ({ onCreate }) => {
  const [form] = Form.useForm()
  const handleCreate = async () => {
    await onCreate(await form.validateFields())
  }
  return (
    <Drawer
      open
      title="创建时间轴"
      placement="bottom"
      footer={false}
      maskClosable={false}
      closable={false}
      styles={{
        wrapper: {
          height: 500
        }
      }}
      extra={
        <AsyncButton type="primary" request={handleCreate}>
          发布
        </AsyncButton>
      }
    >
      <Form
        initialValues={{
          cover: defaultTimelineCover
        }}
        form={form}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Box
          sx={{
            py: 2,
            gap: 2,
            width: 400,
            display: 'grid',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: '标题不能为空' }]}
          >
            <AntdFormInput
              placeholder="输入标题"
              variant="outlined"
              size="lg"
            />
          </Form.Item>

          <Form.Item name="desc">
            <AntdFormTextarea
              placeholder="写下描述"
              variant="outlined"
              minRows={3}
              size="lg"
            />
          </Form.Item>

          <Form.Item
            name="cover"
            rules={[{ required: true, message: '封面图不可为空' }]}
          >
            <Upload
              request={(file) => upload({ file })}
              uploadText="封面图"
            ></Upload>
          </Form.Item>
        </Box>
      </Form>
    </Drawer>
  )
}

export default CreateTimeline
