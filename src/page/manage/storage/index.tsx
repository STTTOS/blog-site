import { Tabs } from 'antd'
import { useSearchParams } from 'react-router-dom'

import Temp from './Temp'
import Permanet from './Permanet'

// 文件存储服务页面
const Page = () => {
  const [query, setQuery] = useSearchParams()
  const defaultActiveKey = query.get('tab') || '1'

  return (
    <div>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        onChange={(key) => setQuery([['tab', key]])}
        items={[
          { label: '持久化存储', key: '1', children: <Permanet /> },
          { label: '临时上传(定期删除)', key: '2', children: <Temp /> }
        ]}
      />
    </div>
  )
}

export default Page
