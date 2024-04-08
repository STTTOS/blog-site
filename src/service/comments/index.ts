import type { Comment } from './types'

import request from '../../utils/http'

interface AddCommentRequest {
  articleId: number
}

export async function addComment(
  params: Pick<Comment, 'content' | 'parentCommentId'> & AddCommentRequest
) {
  await request('api/comment/add', params)
}
export async function deleteComment(
  params: Pick<Comment, 'id'> & { hasChildren: boolean }
) {
  await request('api/comment/delete', params)
}
export async function getComments(params: { articleId: number }) {
  const { data } = await request<{ list: Comment[]; total: number }>(
    'api/comment/list',
    params
  )
  return data
}
