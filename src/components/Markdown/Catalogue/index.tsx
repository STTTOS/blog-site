import 'markdown-navbar/dist/navbar.css'
import MarkDownNav from 'markdown-navbar'

import './index.less'

interface IProps {
  value?: string
}

const Index: React.FC<IProps> = ({ value = '' }) => {
  return <MarkDownNav source={'\n' + value} ordered updateHashAuto={false} />
}

export default Index
