import type { MenuInfo } from 'rc-menu/lib/interface'

import { Menu, Layout } from 'antd'
import { useMemo, useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

import menuItems from './menuItems'
import { useUserInfo } from '@/model'
import styles from './index.module.less'
import { logoImg } from '@/globalConfig'
import { getUser } from '@/service/user'
import { ResBasic } from '@/utils/types'
import Loading from '@/components/Loading'
import Redirect from '@/components/Redirect'
import PopoverHandle from '@/layout/popoverHandle'

const { Content, Header, Footer, Sider } = Layout

const ManageLayout = () => {
  const { set } = useUserInfo()
  const [error, setError] = useState<{ response: ResBasic<null> }>()
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const activeKey = [pathname.split('/').slice(2).join('/')]
  const openKey = activeKey.map((item) => item.split('/')[0])
  const onMenuItemClick = ({ key }: MenuInfo) => {
    navigate(`/manage/${key}`)
  }

  const children = useMemo(() => {
    if (loading) return <Loading />

    if (pathname.includes('markdown')) return <Outlet />

    if (error?.response.code === 401) {
      return <Redirect to="/login" />
    }

    return (
      <Layout className={styles.container}>
        <Sider
          collapsible
          theme="light"
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className={styles.logo}>
            <img
              src={logoImg}
              className={styles.logoSvg}
              onClick={() => navigate('/')}
            />
            <span className={styles.logoName}>木木记</span>
          </div>
          <Menu
            selectedKeys={activeKey}
            defaultOpenKeys={openKey}
            onClick={onMenuItemClick}
            theme="light"
            items={menuItems}
            mode="inline"
          />
        </Sider>
        <Layout className={styles.contentLayout}>
          <Header className={styles.header}>
            <PopoverHandle />
          </Header>
          <Content className={styles.content}>
            <Outlet />
          </Content>
          <Footer>MuMuIo Designed by Sanfen, GuoSen, JingLi. 2022</Footer>
        </Layout>
      </Layout>
    )
  }, [loading, pathname, collapsed, activeKey, error])

  // useNewFeatureInfo()

  useEffect(() => {
    getUser('manage')
      .then(set, setError)
      .finally(() => {
        setLoading(false)
      })
  }, [])
  return children
}

export default ManageLayout
