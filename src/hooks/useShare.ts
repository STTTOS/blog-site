import { useEffect } from 'react'
import { useLocation } from 'react-router'

import { getTencentJSApi } from '@/service/common'

export const useShare = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // const { href } = location
    getTencentJSApi('https://www.wishufree.com/timeline/1').then(
      ({ timestamp, signature, noncestr }) => {
        wx.config({
          debug: true,
          timestamp,
          signature,
          nonceStr: noncestr,
          jsApiList: ['ready', 'updateAppMessageShareData'],
          appId: 'wxd696395b3b2bf287'
        })
      }
    )

    wx.error(console.log)
    wx.ready(() => {
      wx.updateAppMessageShareData({
        title: document.title,
        imgUrl:
          'https://gw.alipayobjects.com/mdn/rms_e695cc/afts/img/A*FGZWSbhPyjAAAAAAAAAAAAAAARQnAQ',
        desc: 'test',
        link: 'https://www.wishufree.com/timeline/1',
        success() {
          console.log('success')
        },
        fail: console.log
      })
    })
  }, [pathname])
}
