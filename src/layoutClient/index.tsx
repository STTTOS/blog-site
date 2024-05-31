import { Button } from 'antd'
import { useEffect } from 'react'
import { BookOutlined } from '@ant-design/icons'
import { Outlet, useNavigate } from 'react-router-dom'

import { useUserInfo } from '@/model'
import styles from './index.module.less'

const Index: React.FC = () => {
  const nav = useNavigate()
  const { fetch } = useUserInfo()

  useEffect(() => {
    fetch('client')
  }, [])
  return (
    <div className={styles.wrapper}>
      <Button
        className={styles.button}
        icon={<BookOutlined />}
        onClick={() => nav(`/manage/article/list`)}
      />
      <Outlet />
    </div>
  )
}

export default Index
