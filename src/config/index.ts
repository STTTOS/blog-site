type ENV = 'mock' | 'proxy'

// 环境变量
const env: ENV = 'proxy'

export const baseUrl =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  env === 'mock' ? 'http://localhost:4000' : ''

export const domain = 'www.wishufree.com'
