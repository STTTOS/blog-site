import { message } from 'antd'
import remarkGfm from 'remark-gfm'
import remarkIns from 'remark-ins'
import Markdown from 'react-markdown'
import { memo, type FC } from 'react'
import rehypeVideo from 'rehype-video'
import remarkBreaks from 'remark-breaks'
import { useLocation } from 'react-router'
import { CopyOutlined } from '@ant-design/icons'
import { themes, Highlight, RenderProps } from 'prism-react-renderer'

import copy from '@/utils/copy'
import CardImage from '../CardImage'
import Video from '@/components/Video'
import { ElementBeForbidden } from '@/components/Image'

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
  secure?: boolean
  isPrivate?: boolean
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void
}> = ({ children, isPrivate, secure = false, onChange }) => {
  const { pathname } = useLocation()
  // 从children中找到目标url
  // 用正则匹配 ![.*](url) 并删除
  const handleDelete = (url: string) => {
    const regex = new RegExp(
      `\\\n*\\!\\[[^[\\]]+\\]\\(\\\n*${url.replaceAll('?', '\\?')}\\\n*\\)`
    )
    if (regex.test(children)) {
      setTimeout(() => {
        onChange?.(children.replace(regex, ''))
      }, 300)
      return true
    }
    message.info('错误: 未找到元素, 请手动删除链接')
    return false
  }
  return (
    <Markdown
      rehypePlugins={[[rehypeVideo, { details: false }]]}
      remarkPlugins={[remarkGfm, remarkIns, remarkBreaks]}
      components={{
        img(props) {
          if (isPrivate) return ElementBeForbidden

          return (
            <CardImage
              {...props}
              secure={secure}
              onDelete={
                // TODO: 以后改成参数控制
                pathname.includes('markdown') || pathname.includes('timeline')
                  ? handleDelete
                  : undefined
              }
            />
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
