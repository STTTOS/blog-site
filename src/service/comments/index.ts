import type { Comment } from './types'

interface AddCommentRequest {
  articleId: number;
  parentCommentId?: number;
}
import request from '../../utils/http'

export async function addComment(params: Pick<Comment, 'content'> & AddCommentRequest) {
  await request('api/comment/add', params)
}
export async function getComments(params: {articleId: number }) {
  const { data } = await request<{ list: Comment[]; total: number }>('api/comment/list', params)
  return data
}