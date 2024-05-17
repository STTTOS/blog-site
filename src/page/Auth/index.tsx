import { useEffect } from 'react'
import { SHA256 } from 'crypto-js'
import { useRequest } from 'ahooks'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Form, Input, Button, Tooltip, message } from 'antd'
import {
  Link,
  useParams,
  useLocation,
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import styles from './index.module.less'
import { veirfySecureKey } from '@/service/user'

const secureKey = 'secureKey'
const Auth = () => {
  const nav = useNavigate()
  const [query] = useSearchParams()
  const params = useParams()
  const { runAsync, loading } = useRequest(veirfySecureKey)
  const handleVerifyPwd = async (secureKey: string) => {
    const encrypted = SHA256(secureKey).toString()

    const access = await runAsync({ secureKey: encrypted, id: params.id })
    if (access) {
      sessionStorage.setItem('secureKey', encrypted)
      nav(decodeURIComponent(query.get('from') || ''))
    } else {
      message.error('密码不正确')
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h2>访问限制</h2>
        <div className={styles.tips}>
          需要你的安全密码
          <Tooltip
            title={
              <span>
                可在
                <Link to="/manage/author" target="_blank">
                  账号管理
                </Link>
                <span>处设置</span>
                <span style={{ fontWeight: 'bold' }}>安全密码</span>
              </span>
            }
          >
            <QuestionCircleOutlined style={{ marginLeft: 6 }} />
          </Tooltip>
        </div>
        <Form onFinish={({ secureKey }) => handleVerifyPwd(secureKey)}>
          <Form.Item
            name="secureKey"
            rules={[{ required: true, message: '不可为空' }]}
          >
            <Input.Password placeholder="你的安全密码" />
          </Form.Item>
          <div>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.button}
              loading={loading}
            >
              确认
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
export const useNeedAuth = ({
  isNeed
}: {
  isNeed: () => Promise<boolean>
  // validate: () => Promise<any>
}) => {
  const location = useLocation()
  const nav = useNavigate()
  const params = useParams()
  const { loading, runAsync } = useRequest(isNeed, { manual: true })
  const key = sessionStorage.getItem(secureKey)

  useEffect(() => {
    if (!key) {
      runAsync().then((need) => {
        if (need) {
          nav(
            `/auth/${params.id}?from=${encodeURIComponent(
              location.pathname + location.search
            )}`
          )
        }
      })
    }
  }, [runAsync, key])
  return {
    key,
    goAuth: () => nav('/auth'),
    validating: loading
  }
}

export default Auth
