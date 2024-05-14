import type { Article } from './types'
import type { Params } from 'ahooks/lib/usePagination/types'

import { message } from 'antd'

import { User } from '../user/types'
import request from '../../utils/http'

const getArticles = async (pageParams: Params[0], params: { id: string }) => {
  const { data } = await request<{ list: Article[]; total: number }>(
    'api/article/list',
    {
      ...params,
      ...pageParams
    }
  )
  return data
}

const getClientArticles = async (params: {
  tagId?: number
  authorId?: number
}) => {
  const {
    data: { list }
  } = await request<{ list: Article[]; total: number }>(
    'api/article/clientList',
    params
  )

  return list
}

const getArticleRecycleList = async (
  pageParams: Params[0],
  params: { id: string }
) => {
  const { data } = await request<{ list: Article[]; total: number }>(
    'api/article/recycle/list',
    {
      ...params,
      ...pageParams
    }
  )

  return data
}

async function addArticle(params: Omit<Article, 'id' | 'createdAt'>) {
  const { msg } = await request<null>('api/article/add', params)

  message.success(msg)
}

async function deleteArticle(params: Pick<Article, 'id'>) {
  const { msg } = await request<null>('api/article/delete', params)

  message.success(msg)
}

async function updateArticle(params: Omit<Article, 'createdAt'>) {
  const { msg } = await request<null>('api/article/update', params)

  message.success(msg)
}

async function getArticleDetail(params: Pick<Article, 'id'>) {
  const { data } = await request<Article>('api/article/detail', params)

  return data
}

async function getSimilarArticles(params: Pick<Article, 'id'>) {
  const {
    data: { list }
  } = await request<{ list: Article[] }>('api/article/similar', params)

  return list
}

async function countArticle(params: Pick<Article, 'id'>) {
  request<null>('api/article/count', params)
}

async function visibleUsers(params: Pick<Article, 'id'>) {
  const {
    data: { list }
  } = await request<{
    list: Array<Pick<User, 'id' | 'avatar' | 'username' | 'name'>>
  }>('api/article/visibleUsers', params)
  return list
}
async function recoverAritcle(params: Pick<Article, 'id'>) {
  await request('api/article/recover', params)
  message.success('恢复成功')
}

async function deleteAriclePhysically(params: Pick<Article, 'id'>) {
  await request('api/article/physicalDelete', params)
  message.success('删除成功')
}

export {
  getArticles,
  addArticle,
  deleteArticle,
  updateArticle,
  getArticleDetail,
  getSimilarArticles,
  countArticle,
  getClientArticles,
  visibleUsers,
  getArticleRecycleList,
  recoverAritcle,
  deleteAriclePhysically
}
