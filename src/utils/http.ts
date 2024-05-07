/* eslint-disable @typescript-eslint/no-explicit-any */
import { message } from 'antd'
import { join } from 'path-browserify'
import { extend, ResponseError, RequestOptionsInit } from 'umi-request'

import { history } from '@/main'
import { ResBasic } from './types'
import { baseUrl } from '@/config'

// 响应code异常处理程序
const request = extend({
  timeout: 30 * 1000,
  timeoutMessage: '网络超时'
})

request.interceptors.request.use((url: string, options: any) => {
  return { url: baseUrl + url, options }
})

request.interceptors.response.use(async (response) => {
  return response
})

async function betterRequest<R>(
  url: string,
  params?: Record<string, any>,
  file?: FormData,
  options?: RequestOptionsInit & { origin?: boolean }
) {
  try {
    const response = await request<Promise<ResBasic<R>>>(join('/', url), {
      method: 'POST',
      data: file || params,
      requestType: file ? 'form' : 'json',
      ...options
    })
    if (options?.origin) return response

    const { code, data, msg } = response

    if (code === 401) {
      // history.push(`/login?from=${encodeURIComponent(location.pathname)}`)
      location.href = `/login?from=${encodeURIComponent(location.pathname)}`
    } else if (code === 403) {
      // history.push('/403')
      location.href = '/403'
    } else if (code === 404) {
      location.href = '/404'
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
      history.push('/500')
    }
    throw error
  }
}

export default betterRequest
