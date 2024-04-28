import { useRef } from 'react'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

import Parser from '../Parser'
import { upload } from '@/service/common'
import video from '../plugins/videoUpload'
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

  return (
    <MdEditor
      ref={ref}
      value={value}
      key={String(isPrivate)}
      style={{ height: '100%' }}
      onImageUpload={handleUpload}
      imageAccept=".png,.jpeg,.jpg"
      onChange={({ text }) => onChange(text)}
      renderHTML={(text) => <Parser isPrivate={isPrivate}>{text}</Parser>}
    />
  )
}

export default Index
