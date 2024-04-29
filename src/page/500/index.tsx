import { Space, Button } from 'antd'
import { useNavigate } from 'react-router'

import styles from './index.module.less'

const Error500 = () => {
  const nav = useNavigate()
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <img
          className={styles.icon}
          src="http://wishufree.com/static/files/oops__974dbcaf98f0780265e847209.png"
        />
        <div>
          <div className={styles.title}>坏了</div>
          <div className={styles.desc}>服务器内部出错了...</div>
        </div>
      </div>
      <Space className={styles.button}>
        <Button type="link" ghost onClick={() => nav('/')}>
          回到首页
        </Button>
        <Button type="link" ghost onClick={() => nav(-1)}>
          返回上一页
        </Button>
      </Space>
    </div>
  )
}

export default Error500
