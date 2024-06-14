import { message } from 'antd'

import request from '../../utils/http'
import { NotifyParams } from './types'

export async function sendNotify(params: NotifyParams) {
  await request('api/system/sendNotify', params)
  message.success('消息推送成功')
}
