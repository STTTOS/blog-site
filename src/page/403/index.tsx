import { Space } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import styles from './index.module.less'
import FooterActions from '@/components/FooterActions'

const Forbidden = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <ExclamationCircleOutlined className={styles.icon} />
        <Space direction="vertical">
          <div className={styles.title}>403</div>
          <div className={styles.desc}>哦豁, 莫得权限哈</div>
        </Space>
      </div>
      <FooterActions showLoginAnotherAccount />
    </div>
  )
}

export default Forbidden
