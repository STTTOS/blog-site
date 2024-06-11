/* eslint-disable no-unused-vars */
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
  }
}
declare const wx: {
  config(options: {
    // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    debug?: boolean
    // 必填，公众号的唯一标识
    appId: string
    // 必填，生成签名的时间戳
    timestamp: number
    // 必填，生成签名的随机串
    nonceStr: string
    // 必填，签名
    signature: string
    // 必填，需要使用的JS接口列表
    jsApiList: Array<'updateAppMessageShareData' | 'ready'>
  })

  updateAppMessageShareData(options: {
    // 分享标题
    title: string
    // 分享描述
    desc?: string
    // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    link: string
    // 分享图标
    imgUrl: string
    success?(): void
    fail?(): void
  })
  updateTimelineShareData: typeof updateAppMessageShareData
  /**成功的回调函数 */
  ready(callback?: () => void): void
  error(callback?: (error: any) => void): void
}
