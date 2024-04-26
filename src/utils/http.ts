/* eslint-disable @typescript-eslint/no-explicit-any */
import { join } from 'path-browserify'
import { extend, RequestOptionsInit } from 'umi-request'

import { ResBasic } from './types'
import { baseUrl } from '../config'

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
    const {
      data,
      code,
      msg = '系統繁忙'
    } = await request<Promise<ResBasic<R>>>(join('/', url), {
      method: 'POST',
      data: file || params,
      requestType: file ? 'form' : 'json',
      ...options
    })

    if (options?.origin) return { data, code, msg }

    if (code !== 200) {
      throw new Error(msg)
    }

    return { data, msg }
  } catch (error) {
    const errMsg = (error as Error).message

    // 错误提示
    // 继续抛出错误, 为了终止之后的Promise处理进程
    throw new Error(errMsg)
  }
}

export default betterRequest
