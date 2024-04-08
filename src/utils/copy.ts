import { message } from 'antd'
import copyText from 'copy-to-clipboard'

export default function copy(text: string) {
  const success = copyText(text)

  if (!success) return
  message.success('复制成功')
}
