import { User } from '../user/types'

type GeneralCommentType = 'article' | 'moment'

export interface GeneralComment {
  id: number
  type: GeneralCommentType
  content: string
  moduleId: number
  user: User
  replyToUser: User
  createdAt: string
}
