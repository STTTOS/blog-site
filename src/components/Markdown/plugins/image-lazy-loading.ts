// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export default function lazyLoadingPlugin(md: unknown) {
  const defaultImageRenderer = md.renderer.rules.image

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const imgSrc = token.attrGet('src')

    token.attrSet('data-src', imgSrc)
    token.attrSet('src', '/static/7855d7716bd637e33ae511c05.png')

    token.attrJoin('data-sizes', 'auto')
    token.attrJoin('class', 'lazyload blur-up')

    return defaultImageRenderer(tokens, idx, options, env, self)
  }
}
