/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { pick } from 'ramda'
import { Card } from '@mui/joy'
import remarkGfm from 'remark-gfm'
import remarkIns from 'remark-ins'
import { memo, type FC } from 'react'
import Markdown from 'react-markdown'
import rehypeVideo from 'rehype-video'
import remarkBreaks from 'remark-breaks'
import { CopyOutlined } from '@ant-design/icons'
import { themes, Highlight, RenderProps } from 'prism-react-renderer'

import copy from '@/utils/copy'
import Video from '@/components/Video'
import Image, { ElementBeForbidden } from '@/components/Image'

const renderChildren = ({
  style,
  tokens,
  getLineProps,
  getTokenProps
}: RenderProps) => (
  <pre style={style}>
    {tokens.map((line, i) => (
      <div key={i} {...getLineProps({ line })}>
        <span style={{ marginRight: 10 }}>{i + 1}</span>
        {line.map((token, key) => (
          <span key={key} {...getTokenProps({ token })} />
        ))}
      </div>
    ))}
  </pre>
)
const SyntaxHighlighter = memo(({ children, language }: any) => {
  return (
    <Highlight code={children} language={language} theme={themes.oneDark}>
      {renderChildren}
    </Highlight>
  )
})
const Parser: FC<{
  children: string
  isPrivate?: boolean
  secure?: boolean
}> = ({ children, isPrivate, secure = false }) => {
  return (
    <Markdown
      rehypePlugins={[[rehypeVideo, { details: false }]]}
      remarkPlugins={[remarkGfm, remarkIns, remarkBreaks]}
      components={{
        img(props) {
          if (isPrivate) return ElementBeForbidden

          return (
            <Card component="div" style={{ marginBottom: 10 }}>
              <Image
                {...pick(['src', 'alt'], props)}
                key={props.src}
                secure={secure}
              />
            </Card>
          )
        },
        video(props) {
          if (isPrivate) return ElementBeForbidden
          return <Video src={props.src} />
        },
        code(props) {
          const { children, className } = props
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <div style={{ position: 'relative' }}>
              <CopyOutlined
                onClick={() => copy(props.children as string)}
                style={{ position: 'absolute', right: -10, top: -20 }}
              />
              <SyntaxHighlighter language={match?.[1]}>
                {String(children)}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className={className}>{children}</code>
          )
        },
        a({ href, children }) {
          return <a href={href} target="_blank" children={children} />
        }
      }}
    >
      {children}
    </Markdown>
  )
}

export default Parser
