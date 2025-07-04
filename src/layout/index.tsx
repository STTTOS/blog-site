import type { MenuInfo } from 'rc-menu/lib/interface'

import { Menu, Badge, Layout } from 'antd'
import { useMemo, useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

import menuItems from './menuItems'
import styles from './index.module.less'
import { logoImg } from '@/globalConfig'
import { useUnreadMomentsCount } from '@/model'
import PopoverHandle from '@/layout/popoverHandle'
import withLoginCheck from '@/wrapper/withLoginCheck'
import { setUnreadMomentCount } from '@/model/useUnreadMomentsCount'

const { Content, Header, Footer, Sider } = Layout

const ManageLayout = () => {
  const { fetch, count } = useUnreadMomentsCount()

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const activeKey = [pathname.split('/').slice(2).join('/')]
  const openKey = activeKey.map((item) => item.split('/')[0])
  const onMenuItemClick = ({ key }: MenuInfo) => {
    if (key === 'moments') {
      window.open('/moments')
      // 以下两函数调用是有耦合的,通过localStorage共享变量
      setUnreadMomentCount()
      fetch()
    } else navigate(`/manage/${key}`)
  }

  const children = useMemo(() => {
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
            defaultOpenKeys={openKey}
            onClick={onMenuItemClick}
            theme="light"
            items={menuItems.map((item) => {
              if (item?.key === 'moments') {
                return {
                  ...item,
                  label: (
                    <Badge count={count} size="small">
                      <span style={{ paddingRight: 6 }}>动态</span>
                    </Badge>
                  )
                }
              }
              return item
            })}
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
  }, [pathname, collapsed, activeKey])

  useEffect(() => {
    fetch()
  }, [])
  return children
}

export default withLoginCheck(ManageLayout)
