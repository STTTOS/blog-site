import { Space, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import styles from './index.module.less'

const Forbidden = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <ExclamationCircleOutlined className={styles.icon} />
        <Space direction="vertical">
          <div className={styles.title}>哦豁</div>
          <div className={styles.desc}>莫得权限哈</div>
        </Space>
      </div>
      <Space className={styles.footer}>
        <Button type="link" href="/">
          回到首页
        </Button>
        <Button type="link" href="/login">
          登录其他账号
        </Button>
      </Space>
    </div>
  )
}

export default Forbidden
