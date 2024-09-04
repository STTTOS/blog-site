import type { Key } from 'react'

import { User } from '../user/types'

export interface MessageContent {
  message: string
  at_name_to_id?: {
    [key: string]: number
  }
}
export interface Comment {
  content: MessageContent
  createdAt: string
  id: Key
  replies?: Comment[]
  children?: Comment[]
  avatar?: string
  name: string
  isContributor: boolean
  parentCommentId?: Key
  rootId?: Key
  authorId: Key
  articleId: number
  parentUser?: User
}
