import type { Key } from 'react'

export interface Comment {
  content: string
  createdAt: string
  id: Key
  replies?: Comment[]
  avatar?: string
  name: string
  isContributor: boolean
  parentCommentId?: Key
  authorId: Key
}
