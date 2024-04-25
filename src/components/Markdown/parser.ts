import type { EditOptionProps } from '@/model/editOptions'

import hljs from 'highlight.js'
import mark from 'markdown-it-mark'
import MarkdownIt from 'markdown-it'
import insert from 'markdown-it-ins'
import subscript from 'markdown-it-sub'
import superscript from 'markdown-it-sup'
import abbreviation from 'markdown-it-abbr'
import footnote from 'markdown-it-footnote'
import tasklists from 'markdown-it-task-lists'
import 'highlight.js/styles/atom-one-light.css'
import 'react-markdown-editor-lite/lib/index.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { html5Media } from 'markdown-it-html5-media'

import videoParser from './plugins/video-parser'
import lazyLoadingPlugin from './plugins/image-lazy-loading'

export const useMdParse = (config?: EditOptionProps) => {
  // Initialize a markdown parser
  /* Markdown-it options */

  const mdParser = new MarkdownIt({
    // 使用br换行
    breaks: true,
    // 高亮链接
    linkify: true,
    highlight(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang, ignoreIllegals: true })
            .value
        } catch (__) {
          // nothing to do
        }
      }

      return ''
    }
  })
    .use(mark)
    .use(insert)
    .use(footnote)
    .use(subscript)
    .use(superscript)
    .use(abbreviation)
    // do not sort these plugin, the are sort related
    .use(html5Media, {
      videoAttrs: 'class="markdown-it-video" controls preload="none"'
    })
    .use(videoParser(config))
    .use(lazyLoadingPlugin(config))
    .use(tasklists, { label: true })
  return mdParser
}
