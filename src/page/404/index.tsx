import styles from './index.module.less'
import FooterActions from '@/components/FooterActions'

const Page404 = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>404</div>
      <div className={styles.desc}>你的到东西不存在</div>
      <FooterActions />
    </div>
  )
}

export default Page404
