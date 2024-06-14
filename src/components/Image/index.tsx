import Modal from '@mui/material/Modal'
import { basename } from 'path-browserify'
import { CloseCircleOutlined } from '@ant-design/icons'
import { CloudDownloadOutlined } from '@ant-design/icons'
import { type FC, useMemo, useState, useEffect } from 'react'
import 'react-lazy-load-image-component/src/effects/blur.css'
import {
  LazyLoadImage,
  ScrollPosition,
  trackWindowScroll
} from 'react-lazy-load-image-component'

import styles from './index.module.less'
import { sessionSecureKey } from '@/page/auth'
import { placeholderImageSrc } from '@/config'

interface ImageProps {
  src?: string
  alt?: string
  /**是否安全访问模式, 如果是, 则使用xhr在请求头中带上secureKey手动请求 */
  secure?: boolean
  scrollPosition: ScrollPosition
}

export function getOriginUrl(src: string) {
  if (src.startsWith('https:')) return src.replace('/compressed', '/origin')
  return `/static/origin/${basename(src)}`
}
export function accessOriginImage(src: string) {
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
export function getFilename(src: string) {
  const [name] = src.split('?token=')
  return basename(name)
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

const BetterImage: FC<ImageProps> = ({
  src,
  secure = false,
  alt,
  scrollPosition
}) => {
  const [open, setOpen] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [loadingImage, setLoadingImage] = useState(false)
  // 原图地址
  const originSrc = useMemo(() => {
    return getOriginUrl(src!)
  }, [src])

  const [previewSrc, setPreviewSrc] = useState(src)
  // 如果是安全模式, 手动控制图片的请求
  // 先加载占位图片
  const [imgSrc, setImgSrc] = useState(() => {
    if (secure) return placeholderImageSrc
    return src
  })

  const handleDownload = async () => {
    const access = await accessOriginImage(originSrc)

    const a = document.createElement('a')
    a.download = getFilename(src!)
    a.href = access ? originSrc : src!
    a.click()
  }

  useEffect(() => {
    if (src && loadingImage && secure) {
      loadImage(src).then(({ success, url }) => {
        setImgSrc(url)
        setLoadError(!success)
      })
    }
  }, [src, loadingImage, secure])

  useEffect(() => {
    if (open) {
      accessOriginImage(originSrc).then((access) => {
        if (access) {
          setPreviewSrc(originSrc)
        }
      })
    }
  }, [originSrc, src, open])
  return (
    <div className={styles.wrapper}>
      <LazyLoadImage
        alt={alt}
        effect="blur"
        style={{ display: 'block', cursor: 'zoom-in', margin: '0 auto' }}
        src={imgSrc}
        onError={() => setLoadError(true)}
        scrollPosition={scrollPosition}
        onLoad={() => {
          setLoadingImage(true)
        }}
      />

      {!loadError && (
        <div className={styles.op} onClick={() => setOpen(true)}>
          <CloudDownloadOutlined
            onClick={(e) => {
              e.stopPropagation()
              handleDownload()
            }}
            className={styles.download}
          />
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
          <img src={previewSrc} style={{ maxWidth: 'calc(100vw - 30px)' }} />
          <CloseCircleOutlined
            onClick={() => setOpen(false)}
            className={styles.icon}
          />
        </div>
      </Modal>
    </div>
  )
}

export default trackWindowScroll(BetterImage)
