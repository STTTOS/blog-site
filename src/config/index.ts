type ENV = 'mock' | 'proxy'

// 环境变量
const env: ENV = 'proxy'

export const baseUrl =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  env === 'mock' ? 'http://localhost:4000' : ''

export const domain = 'www.wishufree.com'

// 离开页面后, 重新校验安全密码的时间s
export const revalidateTime = 0 * 60

export const defaultTimelineCover =
  'https://xuan-1313104191.cos.ap-chengdu.myqcloud.com/images/compressed/3d604a66dff1470668967f06b14b2570__1962eab5-d645-48da-9710-1003b72e4de0.JPG'
