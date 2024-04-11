import { Tabs } from 'antd'

import Temp from './Temp'
import Permanet from './Permanet'

// 文件存储服务页面
const Page = () => {
  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={[
          { label: '持久化存储', key: '1', children: <Permanet /> },
          { label: '临时上传(定期删除)', key: '2', children: <Temp /> }
        ]}
      />
    </div>
  )
}

export default Page
