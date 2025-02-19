import dayjs from 'dayjs'
import { useRequest } from 'ahooks'
import { Params } from 'ahooks/lib/useAntdTable/types'
import { useMemo, useState, useEffect, ReactNode } from 'react'

import { isSameDay } from '..'
import styles from './index.module.less'
import Moment from '@/components/Moment'
import LoadingBar from '@/components/LoadingBar'
import ScrollWrapper from '@/components/ScrollWrapper'
import { getMomentsOfPlatform } from '@/service/timeline'
import { Moment as MomentType } from '@/service/timeline/types'
import { setUnreadMomentCount } from '@/model/useUnreadMomentsCount'

// 平台所有的时间轴合集
const Page = () => {
  const { loading, runAsync } = useRequest(
    (current = 1) =>
      getMomentsOfPlatform({ pageSize: pageParams.pageSize, current }),
    {
      onSuccess(res) {
        setTotal(res.total)

        if (pageParams.current === 1) setList(res.list)
        else setList((pre) => pre.concat(res.list))
      }
    }
  )
  const [list, setList] = useState<MomentType[]>([])

  const [total, setTotal] = useState(0)
  const [pageParams, setPageParams] = useState<Params[0]>({
    current: 1,
    pageSize: 10
  })
  const allDataHasBeenFetched = useMemo(() => {
    return list.length >= total
  }, [list, total])

  const items = useMemo(() => {
    if (list.length === 0)
      return (
        <div style={{ textAlign: 'center', color: '#d5d5d5' }}>
          {allDataHasBeenFetched ? (
            <em>没有更多数据了...</em>
          ) : (
            <em>下拉加载更多数据...</em>
          )}
        </div>
      )
    const results: ReactNode[] = []
    const map: Map<number, boolean> = new Map()

    list.forEach((item, i) => {
      const year = dayjs(item.createdAt).year()

      if (!map.get(year)) {
        map.set(year, true)
        results.push(<h2 key={year}>{year}年</h2>)
      }
      results.push(
        <Moment
          {...item}
          key={item.id}
          viewMode
          profile={item.timeline?.user}
          hideDate={isSameDay(item.createdAt, list[i - 1]?.createdAt)}
        ></Moment>
      )
    })
    return results
  }, [list])
  useEffect(() => {
    setUnreadMomentCount()
  }, [])
  return (
    <div className={styles.wrapper}>
      <LoadingBar detail={!!list.length} />

      <ScrollWrapper
        debounceTime={200}
        className={styles.scroll}
        onScrollToBottom={async () => {
          if (loading) return
          if (allDataHasBeenFetched) return

          const current = pageParams.current + 1
          setPageParams({
            ...pageParams,
            current
          })
          await runAsync(current)
        }}
      >
        {items}
      </ScrollWrapper>
    </div>
  )
}

export default Page
