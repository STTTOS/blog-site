import { Button } from 'antd'
import { BookOutlined } from '@ant-design/icons'
import { Outlet, useNavigate } from 'react-router-dom'

import styles from './index.module.less'
import useNewFeatureInfo from '@/hooks/useNewFeatureInfo'

const Index: React.FC = () => {
  const nav = useNavigate()

  useNewFeatureInfo()
  return (
    <div className={styles.wrapper}>
      <Button
        className={styles.button}
        icon={<BookOutlined />}
        onClick={() => nav('/manage/article')}
      />
      <Outlet />
    </div>
  )
}

export default Index
