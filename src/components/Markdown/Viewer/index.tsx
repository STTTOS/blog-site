import MdEditor from 'react-markdown-editor-lite'

import Parser from '../Parser'
import useEditOptions from '@/model/editOptions'

interface IProps {
  value?: string
}
const Index: React.FC<IProps> = ({ value }) => {
  const { isPrivate } = useEditOptions()

  return (
    <MdEditor
      value={value}
      config={{
        view: {
          menu: false,
          md: false,
          html: true
        }
      }}
      renderHTML={(text) => <Parser isPrivate={isPrivate}>{text}</Parser>}
    />
  )
}

export default Index
