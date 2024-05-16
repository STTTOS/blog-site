import type { User, Login } from './types'
import type { Params } from 'ahooks/lib/usePagination/types'

import { Key } from 'react'
import { message } from 'antd'
import { SHA256 } from 'crypto-js'
import { join } from 'path-browserify'

import request from '../../utils/http'

// 登录
async function login(params: Login) {
  const { password, ...rest } = params
  const { msg } = await request<{ token: string }>('api/user/signin', {
    ...rest,
    // 密码：密文传递
    password: SHA256(password).toString()
  })
  message.success(msg)
}

export type userInfoType = 'client' | 'manage'
// 获取用户信息 后台
async function getUser(type: userInfoType) {
  const { data } = await request<User>(
    join('api/user', type === 'manage' ? 'loginCheck' : 'info')
  )
  return data
}

const getUsers = async (pageParams: Params[0], params: { id: string }) => {
  const { data } = await request<{ list: User[]; total: number }>(
    'api/user/list',
    {
      ...params,
      ...pageParams
    }
  )
  // {list: [], total: 0}
  return data
}

async function addUser(params: Omit<User, 'id' | 'createdAt'>) {
  const { msg } = await request<null>('api/user/add', params)

  message.success(msg)
}

async function deleteUser(params: Pick<User, 'id'>) {
  const { msg } = await request<null>('api/user/delete', params)

  message.success(msg)
}

async function resetPwd(params: Pick<User, 'id'>) {
  return request<null>('api/user/resetPwd', params)
}

async function updateUser(params: Omit<User, 'createdAt'>) {
  const { msg } = await request<null>('api/user/update', params)

  message.success(msg)
}

async function getAllUser() {
  const {
    data: { list }
  } = await request<{ list: Pick<User, 'id' | 'name'>[] }>('api/user/all')

  return list
}

async function getUserCard(params: Pick<User, 'id'>) {
  const { data } = await request<User & { totalViewCount: number }>(
    'api/user/card',
    params
  )

  return data
}

async function getUsersByRecommend() {
  const {
    data: { list }
  } = await request<User & { list: User[] }>('api/user/recommend', {})

  return list
}

async function veirfySecureKey(params: Pick<User, 'secureKey'> & { id?: Key }) {
  const {
    data: { access }
  } = await request<{ access: boolean }>('api/user/veirfySecureKey', params)
  return access
}

function logout() {
  return request('api/user/logout')
}
export {
  login,
  logout,
  getUser,
  resetPwd,
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  getAllUser,
  getUserCard,
  veirfySecureKey,
  getUsersByRecommend
}
