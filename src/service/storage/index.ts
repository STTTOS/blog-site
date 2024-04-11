import type { Key } from 'react'

import { message } from 'antd'

import request from '../../utils/http'

async function getPersistentFileList() {
  const {
    data: { list }
  } = await request<{ list: string[] }>('api/storage/persistent/list')
  return { list, total: 0 }
}

async function deleteFile(params: { id: Key }) {
  await request<{ list: string[] }>('api/storage/persistent/delete', params)
  message.success('删除成功')
}

export { getPersistentFileList, deleteFile }
