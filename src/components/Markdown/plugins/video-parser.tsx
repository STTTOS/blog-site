// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export default function lazyLoadingPlugin(config?: { isPrivate: boolean }) {
  return function plugin(md) {
    if (config?.isPrivate) {
      md.renderer.rules.video = function videoRender() {
        return `<img src="http://www.wishufree.com/static/files/images__4e6a952a88e11972469c3ae0b.png" class="block" />`
      }
    }
  }
}
