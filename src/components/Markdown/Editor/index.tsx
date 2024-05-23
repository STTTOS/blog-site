import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import { useSearchParams } from 'react-router-dom'

import Parser from '../Parser'
import video from '../plugins/videoUpload'
import useEditOptions from '@/model/editOptions'
import { EditMode } from '@/page/manage/article'
import { upload, uploadImageProtected } from '@/service/common'

// Register plugins if required
MdEditor.use(video)

interface IProps {
  value?: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (val: string) => void
}
const Index: React.FC<IProps> = ({ onChange = () => void 0, value }) => {
  const [query] = useSearchParams()
  const mode = query.get('mode') as EditMode
  // eslint-disable-next-line no-unused-vars
  const handleUpload = async (file: File) => {
    const request = mode === 'secure' ? uploadImageProtected : upload
    const url = await request({ file })
    return `\n${url}`
  }
  const { isPrivate } = useEditOptions()

  return (
    <MdEditor
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
