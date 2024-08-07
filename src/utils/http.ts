/* eslint-disable @typescript-eslint/no-explicit-any */
import { message } from 'antd'
import { join } from 'path-browserify'
import { extend, ResponseError, RequestOptionsInit } from 'umi-request'

import { ResBasic } from './types'
import { baseUrl } from '@/config'
// import { unblock } from '@/page/manage/markdown'
import { history } from '@/components/BrowserRouter'

// 响应code异常处理程序
const request = extend({
  timeout: 60 * 1000,
  timeoutMessage: '网络超时'
})

request.interceptors.request.use((url: string, options: any) => {
  return { url: baseUrl + url, options }
})

request.interceptors.response.use(async (response) => {
  return response
})

/**
 * @description 无视history.block, 强行跳转
 */
function forceJumpTo(path: string, mode: 'href' | 'route' = 'route') {
  // unblock()
  if (mode === 'href') {
    location.href = path
  } else {
    history.push(path)
  }
}

async function betterRequest<R>(
  url: string,
  params?: Record<string, any>,
  file?: FormData,
  options?: RequestOptionsInit & { origin?: boolean }
) {
  try {
    const response = await request<Promise<ResBasic<R>>>(
      url.startsWith('http') ? url : join('/', url),
      {
        method: 'POST',
        data: file || params,
        requestType: file ? 'form' : 'json',
        ...options
      }
    )
    if (options?.origin) return response

    const { code, data, msg } = response

    if (code === 401) {
      forceJumpTo(`/login?from=${encodeURIComponent(location.pathname)}`)
    } else if (code === 403) {
      forceJumpTo('/403')
      history.push('/403')
    } else if (code === 404) {
      forceJumpTo('/404')
    }

    if (code !== 200) {
      throw { data: { msg }, response }
    }
    return { data, msg }
  } catch (error) {
    if (options?.origin) throw error

    const err = error as ResponseError
    const { data, response } = err

    message.error(data.msg || '服务器内部错误')
    if (response.status?.toString().startsWith('50')) {
      forceJumpTo('/500')
    }
    throw error
  }
}
betterRequest.get = (
  url: string,
  options: Parameters<typeof betterRequest>[3]
) => {
  return betterRequest(url, undefined, undefined, { ...options, method: 'get' })
}
export default betterRequest
