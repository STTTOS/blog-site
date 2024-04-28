import classnames from 'classnames'
import { Spin, message } from 'antd'
import Modal from '@mui/material/Modal'
import { basename } from 'path-browserify'
import { type FC, useMemo, useState } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import request from '@/utils/http'
import styles from './index.module.less'

interface ImageProps {
  src?: string
  alt?: string
  isPrivate?: boolean
}
async function accessOriginImage(src: string) {
  try {
    await request(src, undefined, undefined, {
      method: 'get',
      origin: true
    })
    return true
  } catch (error) {
    return false
  }
}

export const ElementBeForbidden = (
  <div style={{ textAlign: 'center' }}>
    <img src="http://www.wishufree.com/static/files/images__4e6a952a88e11972469c3ae0b.png" />
  </div>
)
const Image: FC<ImageProps> = (props) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const originSrc = useMemo(() => {
    return `/static/origin/${basename(props.src!)}`
  }, [props.src])

  const handleDownload = async () => {
    setLoading(true)
    const exsited = await accessOriginImage(originSrc)
    const url = exsited ? originSrc : props.src!
    setLoading(false)

    const a = document.createElement('a')
    a.download = basename(props.src!)
    a.href = url
    a.click()
  }

  const withValidateOriginImageIfExsited = (callback: () => any) => {
    return async function () {
      const access = await accessOriginImage(originSrc)
      if (access) {
        callback()
      } else {
        message.info('该图片并未压缩, 已展示原图')
      }
    }
  }

  if (props.isPrivate) {
    return ElementBeForbidden
  }

  return (
    <div className={styles.wrapper}>
      <LazyLoadImage
        effect="blur"
        placeholderSrc="/static/7855d7716bd637e33ae511c05.png"
        {...props}
      />

      <div className={styles.op}>
        <div
          className={classnames(styles.origin, styles.button)}
          onClick={withValidateOriginImageIfExsited(() => setOpen(true))}
        >
          查看原图
        </div>

        <Spin spinning={loading}>
          <div
            className={classnames(styles.download, styles.button)}
            onClick={handleDownload}
          >
            下载
          </div>
        </Spin>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className={styles.modal}
      >
        <div
          style={{ overflow: 'auto', maxHeight: '100%', textAlign: 'center' }}
        >
          <img src={originSrc} style={{ maxWidth: 'calc(100% - 100px)' }} />
          <CloseCircleOutlined
            onClick={() => setOpen(false)}
            className={styles.icon}
          />
        </div>
      </Modal>
    </div>
  )
}

export default Image
