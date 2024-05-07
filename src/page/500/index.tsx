import styles from './index.module.less'
import FooterActions from '@/components/FooterActions'

const Error500 = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <img
          className={styles.icon}
          src="http://wishufree.com/static/files/oops__974dbcaf98f0780265e847209.png"
        />
        <div>
          <div className={styles.title}>500</div>
          <div className={styles.desc}>坏了, 服务器内部出错了...</div>
        </div>
      </div>
      <FooterActions />
    </div>
  )
}

export default Error500
