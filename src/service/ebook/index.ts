import type { Ebook } from './types'
import type { Params } from 'ahooks/lib/usePagination/types'

import { message } from 'antd'

import request from '../../utils/http'

const getEbooks = async (pageParams: Params[0], params: { id?: string }) => {
  const { data } = await request<{ list: Ebook[]; total: number }>(
    'api/Ebook/list',
    {
      ...params,
      ...pageParams
    }
  )
  // {list: [], total: 0}
  return data
}

async function addEbook(params: Omit<Ebook, 'id'>) {
  const { msg } = await request<null>('api/Ebook/add', params)

  message.success(msg)
}

async function deleteEbook(params: Pick<Ebook, 'id'>) {
  const { msg } = await request<null>('api/Ebook/delete', params)

  message.success(msg)
}

async function updateEbook(params: Ebook) {
  const { msg } = await request<null>('api/Ebook/update', params)

  message.success(msg)
}

export {
  getEbooks,
  addEbook,
  deleteEbook,
  updateEbook
}
