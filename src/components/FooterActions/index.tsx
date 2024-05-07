import type { FC } from 'react'

import { Space, Button } from 'antd'
import { useNavigate } from 'react-router'

import styles from './index.module.less'

interface FooterActionsProps {
  showLoginAnotherAccount?: boolean
}
const FooterActions: FC<FooterActionsProps> = ({
  showLoginAnotherAccount = false
}) => {
  const nav = useNavigate()
  return (
    <Space className={styles.footer}>
      <Button type="link" onClick={() => nav('/')}>
        回到首页
      </Button>
      <Button type="link" onClick={() => nav(-1)}>
        返回上一页
      </Button>
      {showLoginAnotherAccount && (
        <Button type="link" onClick={() => nav('/login')}>
          登录其他账号
        </Button>
      )}
    </Space>
  )
}

export default FooterActions
