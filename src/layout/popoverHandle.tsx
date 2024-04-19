import { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { Space, Tooltip, Popconfirm } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'

import { useUserInfo } from '@/model'
import { logout } from '@/service/user'
import MessageBox from '@/components/MessageBox'

const style: CSSProperties = { fontSize: 20, fontWeight: 'bold' }
const PopoverHandle = () => {
  const navigate = useNavigate()
  const { reset } = useUserInfo()
  const logOut = async () => {
    await logout()
    reset()
    navigate('/login')
  }

  return (
    <Space size="large" align="center">
      <MessageBox />
      <Tooltip title="个人中心" color="blue">
        <UserOutlined style={style} />
      </Tooltip>

      <Popconfirm
        placement="bottom"
        title="确认退出登录吗"
        onConfirm={logOut}
        cancelText="No"
        okText="Yes"
      >
        <Tooltip title="退出登录" color="orange">
          <LogoutOutlined style={style} />
        </Tooltip>
      </Popconfirm>
    </Space>
  )
}

export default PopoverHandle
