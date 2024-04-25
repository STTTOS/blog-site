import type { TableColumnProps } from 'antd'
import type { StroageItemProps } from './staticModel'

import { Form, Space } from 'antd'
import { useCallback } from 'react'
import { useAntdTable } from 'ahooks'
import { basename } from 'path-browserify'

import copy from '@/utils/copy'
import { domain } from '@/config'
import { columns } from './staticModel'
import Upload from '@/components/Upload'
import styles from './index.module.less'
import SafeTable from '@/components/SafeTable'
import AsyncButton from '@/components/AsyncButton'
import { uploadPersistentFile } from '@/service/common'
import { deleteFile, getPersistentFileList } from '@/service/storage'

const Index = () => {
  const [form] = Form.useForm()
  const {
    tableProps,
    search: { reset }
  } = useAntdTable(getPersistentFileList, { form })

  const handleDelete = useCallback(async (url: string) => {
    await deleteFile({ id: basename(url) })
    reset()
  }, [])
  const tableColumns: TableColumnProps<StroageItemProps>[] = [
    ...columns,
    {
      title: '操作',
      fixed: 'right',
      width: 280,
      // eslint-disable-next-line no-unused-vars
      render: (_: unknown, { url, name }) => (
        <Space size="middle">
          <a onClick={() => copy(`${domain}${url}`)}>copy URL</a>
          <a href={url} download={name}>
            download
          </a>
          <AsyncButton danger type="text" request={() => handleDelete(url)}>
            delete
          </AsyncButton>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div className={styles.upload}>
        <Upload
          multiple
          accept="*"
          listType="text"
          maxCount={10}
          maxSize={600 * 1024}
          showFileList={false}
          uploadButtonText="上传文件"
          request={async (file) => {
            const url = await uploadPersistentFile({ file })
            reset()
            return url
          }}
        />
      </div>

      <SafeTable
        columns={tableColumns}
        rowKey="url"
        scroll={{ x: 'max-content' }}
        {...tableProps}
      />
    </div>
  )
}

export default Index
