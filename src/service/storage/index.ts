import type { Key } from 'react'
import type { StroageItemProps } from '@/page/manage/storage/Permanet/staticModel'

import { message } from 'antd'

import request from '../../utils/http'

async function getPersistentFileList() {
  const {
    data: { list }
  } = await request<{ list: StroageItemProps[] }>('api/storage/persistent/list')
  return { list, total: 0 }
}

async function deleteFile(params: { id: Key }) {
  await request('api/storage/persistent/delete', params)
  message.success('删除成功')
}

export { getPersistentFileList, deleteFile }
