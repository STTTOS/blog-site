// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { basename } from 'path-browserify'

export default function lazyLoadingPlugin(config?: { isPrivate: boolean }) {
  return function plugin(md) {
    const defaultImageRenderer = md.renderer.rules.image
    if (config?.isPrivate) {
      md.renderer.rules.image = function imageRender(tokens, idx, ...rest) {
        console.log('触发了解析')
        const token = tokens[idx]
        token.attrSet('class', 'block')
        token.attrSet(
          'src',
          'http://www.wishufree.com/static/files/images__4e6a952a88e11972469c3ae0b.png'
        )

        return defaultImageRenderer(tokens, idx, ...rest)
      }
      return
    }
    // maybe will be used later
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
      const token = tokens[idx]
      const imgSrc = token.attrGet('src')
      const src = '/static/7855d7716bd637e33ae511c05.png'

      token.attrSet('data-src', imgSrc)
      token.attrSet('src', src)

      token.attrJoin('data-sizes', 'auto')
      token.attrJoin('class', 'lazyload blur-up block')

      return `<img src="/static/7855d7716bd637e33ae511c05.png" data-src="${imgSrc}" onClick="window.open('/static/origin/${basename(
        imgSrc
      )}')" class="lazyload blur-up"></img>`
    }
  }
}
