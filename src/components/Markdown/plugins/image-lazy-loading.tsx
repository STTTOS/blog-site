// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { basename } from 'path-browserify'

export default function lazyLoadingPlugin(md: any) {
  // const defaultImageRenderer = md.renderer.rules.image

  // maybe will be used later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const imgSrc = token.attrGet('src')

    token.attrSet('data-src', imgSrc)
    token.attrSet('src', '/static/7855d7716bd637e33ae511c05.png')

    token.attrJoin('data-sizes', 'auto')
    token.attrJoin('class', 'lazyload blur-up')

    return `<img src="/static/7855d7716bd637e33ae511c05.png" data-src="${imgSrc}" onClick="window.open('/static/origin/${basename(
      imgSrc
    )}')" class="lazyload blur-up"></img>`
  }
}
