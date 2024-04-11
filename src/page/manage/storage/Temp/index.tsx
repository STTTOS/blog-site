import { useState } from 'react'
import { List, Divider } from 'antd'
import { basename } from 'path-browserify'

import copy from '@/utils/copy'
import { domain } from '@/config'
import Upload from '@/components/Upload'
import styles from './index.module.less'
import { uploadTempFile } from '@/service/common'

const Temp = () => {
  const [fileList, setFileList] = useState<string[]>([])
  return (
    <div className={styles.wrapper}>
      <Upload
        multiple
        accept="*"
        listType="text"
        showFileList={false}
        maxSize={600 * 1024}
        onChange={(url) => {
          setFileList((pre) => pre.concat(url))
        }}
        uploadButtonText="上传文件(文件列表刷新就会丢失)"
        request={(file) => uploadTempFile({ file })}
      />
      {fileList.length > 0 && (
        <div className={styles.list_wrapper}>
          <Divider orientation="left">文件列表</Divider>
          <List
            bordered
            className={styles.list}
            dataSource={fileList}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a
                    style={{ marginLeft: 12 }}
                    onClick={() => copy(`${domain}${item}`)}
                  >
                    copy
                  </a>
                ]}
              >
                {basename(item)}
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  )
}

export default Temp
