import { useRef } from 'react'
import MdEditor from 'react-markdown-editor-lite'

import video from '../plugins/video'
import { useMdParse } from '../parser'
import { upload } from '@/service/common'
import useEditOptions from '@/model/editOptions'

// Register plugins if required
MdEditor.use(video)

interface IProps {
  value?: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (val: string) => void
}
const Index: React.FC<IProps> = ({ onChange = () => void 0, value }) => {
  const ref = useRef(null)
  // eslint-disable-next-line no-unused-vars
  const handleUpload = async (file: File) => {
    const url = await upload({ file })
    return url
  }
  const { isPrivate } = useEditOptions()
  const mdParser = useMdParse({ isPrivate })

  return (
    <MdEditor
      ref={ref}
      value={value}
      key={String(isPrivate)}
      style={{ height: '100%' }}
      onImageUpload={handleUpload}
      imageAccept=".png,.jpeg,.jpg"
      onChange={({ text }) => onChange(text)}
      renderHTML={(text) => mdParser.render(text)}
    />
  )
}

export default Index
