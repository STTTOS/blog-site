import { Input } from 'antd'

import { IComponent } from '@/utils/createForm/types'

const loginForm: IComponent[] = [
  {
    label: '账户：',
    name: 'username',
    require: true,
    rules: ['username'],
    range: [6, 16],
    placeholder: '请输入账户名'
  },
  {
    label: '密码：',
    name: 'password',
    range: [6, 18],
    require: true,
    placeholder: '请输入登录密码',
    element: <Input.Password />
  }
]

export default loginForm
