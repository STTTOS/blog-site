import { debounce } from 'lodash'
import { type FC, useCallback, type ReactNode, type CSSProperties } from 'react'

interface ScrollWrapperProps {
  children: ReactNode
  /**
   * @description 滚动到底部时需要执行的回调函数
   */
  onScrollToBottom: () => Promise<any>

  /**防抖的间隔时间 */
  debounceTime: number

  style?: CSSProperties
  className?: string
}
// 此容器用于当每次滚动到底部时, 触发回调函数
const ScrollWrapper: FC<ScrollWrapperProps> = ({
  children,
  style,
  className,
  onScrollToBottom,
  debounceTime
}) => {
  const onScroll = useCallback(
    debounce((e: any) => {
      const scrollTop = e.target.scrollTop
      const clientHeight = e.target.clientHeight
      const scrollHeight = e.target.scrollHeight
      if (Math.abs(scrollHeight - (scrollTop + clientHeight)) < 30) {
        onScrollToBottom()
      }
    }, debounceTime),
    [onScrollToBottom]
  )
  return (
    <div
      className={className}
      style={{
        ...style,
        overflow: 'auto'
      }}
      onScroll={onScroll}
    >
      {children}
    </div>
  )
}

export default ScrollWrapper
