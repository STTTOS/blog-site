import MdEditor from 'react-markdown-editor-lite'

import Parser from '../Parser'

interface IProps {
  value?: string
}
const Index: React.FC<IProps> = ({ value }) => {
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
      renderHTML={(text) => <Parser>{text}</Parser>}
    />
  )
}

export default Index
