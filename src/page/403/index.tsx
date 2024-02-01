import { Empty } from 'antd'
import { Link } from 'react-router-dom'
import styles from './index.module.less'

const Forbidden = () => {
  return (
    <div className={styles.wrapper}>
      <Empty description={<span>Forbidden</span>} />
      <Link to="/" className={styles.link}>
        back to home page
      </Link>
      <Link to="/login" className={styles.link}>
        choose another account
      </Link>
    </div>
  )
}

export default Forbidden
