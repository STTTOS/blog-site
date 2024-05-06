import { Space, Button } from 'antd'
import { useNavigate } from 'react-router'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import styles from './index.module.less'

const Forbidden = () => {
  const nav = useNavigate()
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <ExclamationCircleOutlined className={styles.icon} />
        <Space direction="vertical">
          <div className={styles.title}>哦豁</div>
          <div className={styles.desc}>莫得权限哈(需要管理员权限)</div>
        </Space>
      </div>
      <Space className={styles.footer}>
        <Button type="link" onClick={() => nav('/')}>
          回到首页
        </Button>
        <Button type="link" onClick={() => nav(-1)}>
          返回上一页
        </Button>
        <Button type="link" onClick={() => nav('/login')}>
          登录其他账号
        </Button>
      </Space>
    </div>
  )
}

export default Forbidden
