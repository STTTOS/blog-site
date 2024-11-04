import { message } from 'antd'
import copyText from 'copy-to-clipboard'

export default function copy(text: string, customTips = '') {
  const success = copyText(text)

  if (!success) return
  message.success(customTips || '复制成功')
}
