import type { FC } from 'react'

import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import loginForm from './staticModel'
import { useUserInfo } from '@/model'
import { login } from '@/service/user'
import { logoImg } from '@/globalConfig'
import styles from './index.module.less'
import createForm from '@/utils/createForm'

const Index: FC = () => {
  const navigate = useNavigate()
  const { fetch } = useUserInfo()
  // 创建登录表单
  const { formStructure } = createForm({
    formConfig: {
      onFinish: async (form) => {
        await login(form)
        await fetch()
        navigate('/manage')
      }
    },
    components: [
      <div className={styles['form-title']}>
        <img className={styles['logo-img']} src={logoImg} />
        <span className={styles['logo-text']}>登录平台</span>
      </div>,
      ...loginForm,
      <Button
        className={styles['logo-button']}
        htmlType="submit"
        type="primary"
      >
        登录 / 注册
      </Button>
    ]
  })

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-left']}>
        <div className={styles['left-text']}>
          <span>Welcome</span>
          <span>木木记</span>
        </div>
      </div>
      <div className={styles['login-right']}>
        <div className={styles['right-form']}>{formStructure}</div>
      </div>
    </div>
  )
}

export default Index
