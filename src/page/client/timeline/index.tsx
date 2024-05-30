// 展示时间轴的页面
// 通过下拉分页加载moments
// 引入gallery组件, 以及markdown editor编辑 moment content, 更好地展示效果
import { Avatar } from '@mui/joy'
import { useParams } from 'react-router'
import { useMemo, useState } from 'react'
import { useScroll, useRequest } from 'ahooks'
import { Params } from 'ahooks/lib/useAntdTable/types'

import styles from './index.module.less'
import Moment from '@/components/Moment'
import { getMoments, getTimeline } from '@/service/timeline'
import { Moment as MomentType } from '@/service/timeline/types'

const criticalPoint = 380
const step = 40
const TimelineDetail = () => {
  const query = useParams()
  const timelineId = Number(query.id)
  const [list, setList] = useState<MomentType[]>([])
  const scroll = useScroll(null, ({ top }) => top < criticalPoint + step)
  const [pageParams, setPageParams] = useState<Params[0]>({
    current: 1,
    pageSize: 3
  })
  const { data: timelineDetail } = useRequest(getTimeline, {
    defaultParams: [{ id: timelineId }]
  })
  const { loading, runAsync } = useRequest(
    () => getMoments({ id: timelineId, ...pageParams }),
    {
      onSuccess(res) {
        setList(list.concat(res.list))
      }
    }
  )
  const moments = useMemo(() => {
    return list.map((props) => (
      <Moment
        {...props}
        onDelete={(id) => setList(list.filter((item) => item.id !== id))}
      />
    ))
  }, [list])

  const opacity = useMemo(() => {
    const top = scroll?.top || 0
    if (top <= criticalPoint) return 0

    return Math.min(1, Math.abs(top - criticalPoint) / step + 0.4)
  }, [scroll?.top])

  return (
    <div className={styles.wrapper}>
      <div className={styles.top} style={{ opacity }}>
        {timelineDetail?.title}
      </div>
      <header className={styles.header}>
        <img src={timelineDetail?.cover} className={styles.cover} />

        <div className={styles.info}>
          <div>
            <div className={styles.title}>{timelineDetail?.title}</div>
            <em className={styles.desc}>{timelineDetail?.desc}</em>
          </div>

          <Avatar src={timelineDetail?.user.avatar} />
        </div>
      </header>

      <main className={styles.main}>{moments}</main>
    </div>
  )
}

export default TimelineDetail
