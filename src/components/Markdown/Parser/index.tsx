/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import remarkGfm from 'remark-gfm'
import remarkIns from 'remark-ins'
import Markdown from 'react-markdown'
import rehypeVideo from 'rehype-video'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import dark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'

import Image from '@/components/Image'

const Parser: FC<{ children: string }> = ({ children }) => {
  return (
    <Markdown
      rehypePlugins={[[rehypeVideo, { details: false }]]}
      remarkPlugins={[remarkGfm, remarkIns]}
      components={{
        img(props) {
          return <Image {...props} />
        },
        video(props) {
          return (
            <video
              controls
              src={props.src}
              crossOrigin="anonymous"
              style={{ width: '100%' }}
            />
          )
        },
        code(props) {
          const { children, className, ...rest } = props
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter
              {...(rest as any)}
              PreTag="div"
              children={String(children).replace(/\n$/, '')}
              language={match[1] as any}
              style={dark}
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        }
      }}
    >
      {children}
    </Markdown>
  )
}

export default Parser
