import { CSSProperties } from 'react'
import MdEditor from 'react-markdown-editor-lite'

import Parser from '../Parser'

interface IProps {
  value?: string
  style?: CSSProperties
}
const Index: React.FC<IProps> = ({ value, style }) => {
  return (
    <MdEditor
      style={style}
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
