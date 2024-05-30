import type { Moment, Timeline } from './types'
import type { Params } from 'ahooks/lib/usePagination/types'

import { message } from 'antd'

import { User } from '../user/types'
import request from '../../utils/http'

const createTimeline = async (params: Omit<Timeline, 'id'>) => {
  await request('api/timeline/create', params)
  message.success('时间轴创建成功')
}
const getTimelineList = async (
  pageParams: Params[0],
  params: { id?: string }
) => {
  const { data } = await request<{ list: Timeline[]; total: number }>(
    'api/timeline/list',
    {
      ...params,
      ...pageParams
    }
  )
  return data
}

// 查询用户下所有时间轴
const getAllTimeline = async (params: Pick<User, 'id'>) => {
  const {
    data: { list }
  } = await request<{ list: Timeline[] }>(`api/timeline/all/${params.id}`)
  return list
}

const getTimeline = async (params: Pick<Timeline, 'id'>) => {
  const { data } = await request<Timeline>(`api/timeline/detail/${params.id}`)
  return data
}
const deleteTimeline = async (params: Pick<Timeline, 'id'>) => {
  await request(`api/timeline/delete/${params.id}`)
  message.success('删除成功')
}
const addMoment = async ({ timelineId, ...params }: Moment) => {
  await request(`api/timeline/moment/add/${timelineId}`, params)
  message.success('发布成功')
}

const updateMoment = async ({
  id,
  ...params
}: Partial<Omit<Moment, 'timelineId'>>) => {
  await request(`api/timeline/moment/update/${id}`, params)
  message.success('修改成功')
}
const deleteMoment = async (params: Pick<Moment, 'id'>) => {
  await request(`api/timeline/moment/delete/${params.id}`)
  message.success('删除成功')
}
const getMoments = async (params: Pick<Timeline, 'id'> & Params[0]) => {
  const {
    data: { list, total }
  } = await request<{ list: Moment[]; total: number }>(
    `api/timeline/moment/${params.id}`,
    params
  )
  return {
    total,
    list
  }
}

export {
  createTimeline,
  addMoment,
  updateMoment,
  getAllTimeline,
  getTimeline,
  getTimelineList,
  getMoments,
  deleteTimeline,
  deleteMoment
}
