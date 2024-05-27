import { message } from 'antd'
import Modal from '@mui/material/Modal'
import { basename } from 'path-browserify'
import { CloseCircleOutlined } from '@ant-design/icons'
import { type FC, useMemo, useState, useEffect } from 'react'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import styles from './index.module.less'
import AsyncButton from '../AsyncButton'
import { sessionSecureKey } from '@/page/Auth'

interface ImageProps {
  src?: string
  alt?: string
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
async function loadImage(src: string) {
  const headers = new Headers()
  const secureKey = sessionStorage.getItem(sessionSecureKey)
  headers.set('SecureKey', secureKey || '')

  const res = await fetch(src, { headers })
  const blob = await res.blob()
  const imageUrl = URL.createObjectURL(blob)

  return new Promise<{ success: boolean; url: string }>((resolve) => {
    const img = new Image()
    img.src = imageUrl
    img.onload = () => {
      resolve({ success: true, url: imageUrl })
    }
    img.onerror = () => {
      resolve({
        success: false,
        url: '//www.wishufree.com/static/files/imge_load_failed__f22afc55-3ef6-4193-96b7-be0f7828b00a.png'
      })
    }
  })
}
const BetterImage: FC<ImageProps> = (props) => {
  const [open, setOpen] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [loadingImage, setLoadingImage] = useState(false)
  // 原图地址
  const originSrc = useMemo(() => {
    return getOriginUrl(props.src!)
  }, [props.src])
  // 手动控制图片的请求
  // 先加载占位图片
  const [imgSrc, setImgSrc] = useState(
    '//www.wishufree.com/static/files/1b73df93e4744d4eb4ae4ddb515ff9f9__3a173c97-d3a0-4071-8a75-e8b045bf36cb.jpeg'
  )

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

  useEffect(() => {
    if (props.src && loadingImage) {
      loadImage(props.src).then(({ success, url }) => {
        setImgSrc(url)
        setLoadError(!success)
      })
    }
  }, [props.src, loadingImage])
  return (
    <div className={styles.wrapper}>
      <LazyLoadImage
        effect="blur"
        style={{ display: 'block' }}
        src={imgSrc}
        onError={() => setLoadError(true)}
        onLoad={() => {
          setLoadingImage(true)
        }}
      />

      {!loadError && (
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
      )}

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
            outlineColor: '#5CB963',
            position: 'relative'
          }}
        >
          <img src={originSrc} style={{ maxWidth: 'calc(100vw - 30px)' }} />
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
