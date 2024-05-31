// 展示时间轴的页面
// 通过下拉分页加载moments
// 引入gallery组件, 以及markdown editor编辑 moment content, 更好地展示效果
import type { CreateTimelineFormProps } from './CreateTimeline'

import dayjs from 'dayjs'
import { Spin } from 'antd'
import { Avatar } from '@mui/joy'
import classNames from 'classnames'
import { useParams } from 'react-router'
import { useScroll, useRequest } from 'ahooks'
import { useMemo, useState, useCallback } from 'react'
import { Params } from 'ahooks/lib/useAntdTable/types'

import styles from './index.module.less'
import CreateTimeline from './CreateTimeline'
import { defaultTimelineCover } from '@/config'
import { history } from '@/components/BrowserRouter'
import CreateMoment from '@/components/CreateMoment'
import Moment, { EditMode } from '@/components/Moment'
import { Moment as MomentType } from '@/service/timeline/types'
import { getMoments, getTimeline, createTimeline } from '@/service/timeline'

function isSameDay(date1?: string, date2?: string) {
  if (!date1 || !date2) return false

  const d1 = dayjs(date1)
  const d2 = dayjs(date2)

  return (
    d1.year() === d2.year() &&
    d1.month() === d2.month() &&
    d1.date() === d2.date()
  )
}

const criticalPoint = 380
const step = 40
const TimelineDetail = () => {
  const query = useParams()
  const [showAddMoment, setShowAddMoment] = useState(false)
  const timelineId = Number(query.id)
  const isAdd = timelineId < 1
  const { runAsync: create } = useRequest(createTimeline, {
    manual: true
  })

  const handleCreate = async (values: CreateTimelineFormProps) => {
    const id = await create(values)
    history.replace(`/timeline/${id}`)
  }

  const [list, setList] = useState<
    Array<Partial<MomentType> & { mode?: EditMode }>
  >([])
  const scroll = useScroll(null, ({ top }) => top < criticalPoint + step)
  const [pageParams] = useState<Params[0]>({
    current: 1,
    pageSize: 100
  })
  const { data: timelineDetail, loading: fetchingTimeline } = useRequest(
    () => getTimeline({ id: timelineId }),
    {
      refreshDeps: [timelineId],
      manual: isAdd
    }
  )
  const { loading, runAsync: fetchMoments } = useRequest(
    () => getMoments({ id: timelineId, ...pageParams }),
    {
      manual: isAdd,
      onSuccess(res) {
        setList(res.list)
      }
    }
  )
  const handleSave = async () => {
    setShowAddMoment(false)
    await fetchMoments()
  }
  const moments = useMemo(() => {
    if (list.length === 0 && !showAddMoment)
      return (
        <div className={styles.empty}>
          <em className={styles.tips}>什么都没有...</em>
        </div>
      )
    return list.map((props, i) => (
      <Moment
        {...props}
        key={props.id}
        hideDate={isSameDay(props.createdAt, list[i - 1]?.createdAt)}
        timelineId={timelineId}
        onDelete={(id) => setList(list.filter((item) => item.id !== id))}
        onCancel={() => setShowAddMoment(false)}
        onSave={handleSave}
      />
    ))
  }, [list, timelineId, showAddMoment])

  const opacity = useMemo(() => {
    const top = scroll?.top || 0
    if (top <= criticalPoint) return 0

    return Math.min(1, Math.abs(top - criticalPoint) / step + 0.4)
  }, [scroll?.top])

  const [title, desc, avatar, cover] = useMemo(() => {
    return [
      timelineDetail?.title || '时间轴标题',
      timelineDetail?.desc || '描述...',
      timelineDetail?.user.avatar,
      timelineDetail?.cover || defaultTimelineCover
    ]
  }, [timelineDetail])

  const handleAdd = useCallback(() => {
    setShowAddMoment(true)
  }, [])

  return (
    <Spin spinning={fetchingTimeline}>
      <div className={styles.wrapper}>
        <div className={styles.top} style={{ opacity }}>
          <span>{title}</span>
          <CreateMoment
            className={classNames(styles.add, styles.small)}
            onClick={() => {
              handleAdd()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </div>
        <header className={styles.header}>
          <img src={cover} className={styles.cover} />

          <div className={styles.info}>
            <div>
              <div className={styles.title}>{title}</div>
              <em className={styles.desc}>{desc}</em>
            </div>

            <Avatar src={avatar} />
          </div>
        </header>

        <main className={styles.main}>
          <Spin spinning={loading}>
            <CreateMoment
              className={classNames(styles.add, styles.large)}
              onClick={handleAdd}
            />
            {showAddMoment && (
              <Moment
                mode="edit"
                onCancel={() => setShowAddMoment(false)}
                onSave={handleSave}
                timelineId={timelineId}
              />
            )}

            {moments}
          </Spin>
        </main>
        {isAdd && <CreateTimeline onCreate={handleCreate} />}
      </div>
    </Spin>
  )
}

export default TimelineDetail
