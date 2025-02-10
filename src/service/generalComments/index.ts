import type { GeneralComment } from './types'

import request from '../../utils/http'

interface AddGeneralCommentRequest {
  userId: number
  replyToUserId?: number
  parentCommentId?: number
}
export type AddGeneralCommentRequestBody = Pick<
  GeneralComment,
  'type' | 'content' | 'moduleId'
> &
  AddGeneralCommentRequest
export async function addGeneralComment(params: AddGeneralCommentRequestBody) {
  await request('api/generalComment/add', params)
}

export async function deleteGeneralComment(params: Pick<GeneralComment, 'id'>) {
  await request(`api/generalComment/delete/${params.id}`)
}

export async function getAllGeneralComments(
  params: Pick<GeneralComment, 'moduleId' | 'type'>
) {
  const { data } = await request<GeneralComment[]>(
    `api/generalComment/all/${params.moduleId}`,
    params
  )
  return data
}
