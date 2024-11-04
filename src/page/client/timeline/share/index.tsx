// 时间轴分享页面
import { Skeleton } from 'antd'
import { useRequest } from 'ahooks'
import { FC, useState } from 'react'
import { useParams } from 'react-router'

import styles from './index.module.less'
import LoadingBar from '@/components/LoadingBar'
import { getSharedMoment } from '@/service/timeline'
import { Viewer, Catalogue } from '@/components/Markdown'

// 分享指定时刻
const Share: FC = () => {
  const query = useParams()
  const [showCategory, setShowCategory] = useState(false)
  const { loading, data } = useRequest(getSharedMoment, {
    defaultParams: [{ id: Number(query.id) }]
  })

  const { content } = data || {}

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.catalogue}
        style={{
          transform: showCategory ? undefined : 'translate(-100%, 12px)'
        }}
      >
        <Catalogue value={content} />
        <div
          className={styles.catalogue_button}
          onClick={() => setShowCategory(!showCategory)}
        >
          {showCategory ? '收起目录' : '展开目录'}
        </div>
      </div>

      <LoadingBar detail={!loading} />

      <div
        className={styles.main}
        style={
          {
            // marginLeft: showCategory ? 246 + 28 + 6 : 24
          }
        }
      >
        <Skeleton title active loading={loading} paragraph={{ rows: 16 }}>
          <Viewer value={content} />
        </Skeleton>
      </div>
    </div>
  )
}
export default Share
