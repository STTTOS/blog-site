import MdEditor from 'react-markdown-editor-lite'

import mdParser from '../parser'
import { upload } from '@/service/common'

// Register plugins if required
// MdEditor.use([])

interface IProps {
  value?: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (val: string) => void
}
const Index: React.FC<IProps> = ({ onChange = () => void 0, value }) => {
  // eslint-disable-next-line no-unused-vars
  const handleUpload = async (file: File, callback: (url: string) => void) => {
    const url = await upload({ file })
    callback(url)
  }

  return (
    <MdEditor
      value={value}
      style={{ height: '100%' }}
      onImageUpload={handleUpload}
      onChange={({ text }) => onChange(text)}
      renderHTML={(text) => mdParser.render(text)}
    />
  )
}

export default Index
