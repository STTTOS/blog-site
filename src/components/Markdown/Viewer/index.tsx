import classNames from 'classnames'
import { CSSProperties } from 'react'
import MdEditor from 'react-markdown-editor-lite'

import Parser from '../Parser'
import styles from './index.module.less'

interface IProps {
  value?: string
  style?: CSSProperties
  className?: string
  secure?: boolean
}
const Index: React.FC<IProps> = ({ value, style, className, secure }) => {
  return (
    <MdEditor
      className={classNames(styles.wrapper, className)}
      style={style}
      value={value}
      config={{
        view: {
          menu: false,
          md: false,
          html: true
        }
      }}
      renderHTML={(text) => (
        <Parser secure={secure} canEdit={false}>
          {text}
        </Parser>
      )}
    />
  )
}

export default Index
