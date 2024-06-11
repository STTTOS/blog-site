import { Spin } from 'antd'
import Masonry from 'react-masonry-css'
import 'yet-another-react-lightbox/styles.css'
import { PlusOutlined } from '@ant-design/icons'
import Lightbox from 'yet-another-react-lightbox'
import { CloseCircleOutlined } from '@ant-design/icons'
import 'yet-another-react-lightbox/plugins/counter.css'
import { FC, useMemo, useState, useCallback } from 'react'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import {
  Zoom,
  Counter,
  Download,
  Thumbnails
} from 'yet-another-react-lightbox/plugins'

import './index.less'
import styles from './index.module.less'
import Upload from '@/components/Upload'
import { upload } from '@/service/common'
import { placeholderImageSrc } from '@/config'
import { MomentImage } from '@/service/timeline/types'
import { getFilename, getOriginUrl, accessOriginImage } from '../Image'

const breakpointColumnsObj = {
  default: 4,
  1700: 3,
  1300: 2,
  500: 1
}
interface GalleryProps {
  images: MomentImage[]
  mode: 'edit' | 'view'
  // eslint-disable-next-line no-unused-vars
  onChange: (url: string) => void
  momentId?: number
  // eslint-disable-next-line no-unused-vars
  onDelete: (url: string) => void
}
const Gallery: FC<GalleryProps> = ({
  images,
  mode,
  onChange,
  momentId,
  onDelete
}) => {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleClick = ({ index }: { index: number }) => {
    setIndex(index)
    setOpen(true)
  }
  const uploadButton = useMemo(() => {
    if (mode == 'edit')
      return (
        <Upload
          multiple
          listType="text"
          showFileList={false}
          request={async (file) => {
            try {
              setLoading(true)
              const url = await upload({ file })
              onChange(url)
              return url
            } finally {
              setLoading(false)
            }
          }}
        >
          <Spin spinning={loading}>
            <div className={styles.upload}>
              <PlusOutlined
                style={{
                  fontSize: 80,
                  cursor: 'pointer',
                  color: '#5CB963'
                }}
              />
              <span>上传图片</span>
            </div>
          </Spin>
        </Upload>
      )
    return null
  }, [mode, momentId, loading])

  const getDownloadUrl = useCallback(async (src: string) => {
    const originAccess = await accessOriginImage(src)
    const url = originAccess ? getOriginUrl(src!) : src
    return url
  }, [])
  return (
    <div className={styles.wrapper}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {uploadButton}

        {images.map((photo, index) => (
          <div key={index} className={styles.item}>
            <LazyLoadImage
              src={photo.src}
              onClick={() => handleClick({ index })}
              style={{ display: 'block', cursor: 'zoom-in' }}
              placeholderSrc={placeholderImageSrc}
              effect="blur"
            />
            {mode === 'edit' && (
              <CloseCircleOutlined
                className={styles.close}
                onClick={() => onDelete(photo.src)}
              />
            )}
          </div>
        ))}
      </Masonry>

      <Lightbox
        slides={images.map((props, i) => {
          return {
            src: i === index ? getOriginUrl(props.src) : props.src
          }
        })}
        open={open}
        on={{
          view({ index: currentIndex }) {
            setIndex(currentIndex)
          }
        }}
        close={() => setOpen(false)}
        index={index}
        plugins={[Zoom, Download, Counter, Thumbnails]}
        counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
        download={{
          async download({ saveAs, slide }) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore right
            const url = await getDownloadUrl(slide.src)
            saveAs(url, getFilename(url))
          }
        }}
      />
    </div>
  )
}

export default Gallery
