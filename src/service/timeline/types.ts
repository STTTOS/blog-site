import { User } from '../user/types'

export interface Timeline {
  title: string
  desc?: string
  id: number
  cover: string
  user: Pick<User, 'username' | 'id' | 'name' | 'avatar'>
  userId: number
  createdAt?: string
  updatedAt?: string
}
export interface Moment {
  id: number
  createdAt: string
  cover?: string
  content?: string
  images: MomentImage[]
  timelineId: number
}
export interface MomentImage {
  sort: number
  src: string
  momentId?: number
}
