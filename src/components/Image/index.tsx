import { message } from 'antd'
import Modal from '@mui/material/Modal'
import { basename } from 'path-browserify'
import { type FC, useMemo, useState } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import styles from './index.module.less'
import AsyncButton from '../AsyncButton'

interface ImageProps {
  src?: string
  alt?: string
  isPrivate?: boolean
}

function getOriginUrl(src: string) {
  if (src.startsWith('https:')) return src.replace('/compressed', '/origin')
  return `/static/origin/${basename(src)}`
}
function accessOriginImage(src: string) {
  return new Promise<boolean>((resolve) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve(true)
    }
    img.onerror = () => {
      resolve(false)
    }
  })
}

export const ElementBeForbidden = (
  <div style={{ textAlign: 'center' }}>
    <img src="//www.wishufree.com/static/files/images__4e6a952a88e11972469c3ae0b.png" />
  </div>
)
const BetterImage: FC<ImageProps> = (props) => {
  const [open, setOpen] = useState(false)
  const originSrc = useMemo(() => {
    return getOriginUrl(props.src!)
  }, [props.src])

  const handleDownload = async () => {
    const access = await accessOriginImage(originSrc)

    const [name] = props.src!.split('?token=')
    const a = document.createElement('a')
    a.download = basename(name)
    a.href = access ? originSrc : props.src!
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
        placeholderSrc="//:www.wishufree.com/static/7855d7716bd637e33ae511c05.png"
        {...props}
      />

      <div className={styles.op}>
        <AsyncButton
          type="text"
          style={{ color: '#fff' }}
          request={withValidateOriginImageIfExsited(() => setOpen(true))}
        >
          查看原图
        </AsyncButton>

        <AsyncButton
          type="text"
          style={{ color: '#fff' }}
          request={handleDownload}
        >
          下载
        </AsyncButton>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className={styles.modal}
      >
        <div
          style={{
            overflow: 'auto',
            maxHeight: '100%',
            textAlign: 'center',
            outlineColor: '#5CB963'
          }}
        >
          <img src={originSrc} style={{ maxWidth: 'calc(100vw - 100px)' }} />
          <CloseCircleOutlined
            onClick={() => setOpen(false)}
            className={styles.icon}
          />
        </div>
      </Modal>
    </div>
  )
}

export default BetterImage
