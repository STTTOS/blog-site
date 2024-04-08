import type { ReactNode } from 'react'
import type { MenuInfo } from 'rc-menu/lib/interface'

import { Layout, Menu, Empty } from 'antd'
import { useState, useMemo } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

import menuItems from './menuItems'
import styles from './index.module.less'
import { logoImg } from '@/globalConfig'
import switchRender from '@/utils/switchRender'
import PopoverHandle from '@/layout/popoverHandle'
import useNewFeatureInfo from '@/hooks/useNewFeatureInfo'
import Loading from '@/components/Loading'
import Redirect from '@/components/Redirect'
import { useUserInfo } from '@/model'

const { Content, Header, Footer, Sider } = Layout

const ManageLayout = () => {
  const { user, loading } = useUserInfo()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const activeKey = pathname.split('/').slice(-1)

  const onMenuItemClick = ({ key }: MenuInfo) => {
    navigate(`/manage/${key}`)
  }

  const children = useMemo(() => {
    if (loading) return <Loading />

    if (user?.role !== 'admin') return <Redirect to="/403" />

    if (pathname.includes('markdown')) return <Outlet />

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
            onClick={onMenuItemClick}
            theme="light"
            items={menuItems}
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
  }, [user, loading, pathname])

  useNewFeatureInfo()
  return children
}

export default ManageLayout
