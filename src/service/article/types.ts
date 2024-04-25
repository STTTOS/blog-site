import { Tag } from '../tag/types'

interface Article {
  /**
   * 主键id
   */
  id: number
  /**
   * 文章标题
   */
  title: string
  /**
   * 文章摘要
   */
  desc?: string
  /**
   * 封面图
   */
  backgroundUrl?: string
  /**
   * 发布日期
   */
  createdAt: string
  /**
   * 修改日期
   */
  updatedAt: string
  /**
   * 作者id
   */
  authorId?: number
  /**
   * 作者昵称
   */
  authorName?: string
  /**
   * 作者头像
   */
  avatar?: string
  /**
   * 文章所属标签
   */
  tags?: Tag[]
  /**
   * 文章浏览次数
   */
  viewCount: number
  /**
   * markdown
   */
  content: string
  /**
   * 预计阅读时长
   */
  readingTime: string
  /**
   * 字数
   */
  length: number
  /**
   * 可见用户
   */
  coAuthorIds?: string
  /**
   * 是否仅自己可见
   */
  private: boolean
  /**
   * 是否为原创, 默认为true, 否则为转载
   */
  isOrigin: boolean
}

export type { Article }
