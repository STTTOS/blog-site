import { Spin } from 'antd'
import { pick } from 'ramda'
import { useRequest } from 'ahooks'
import Masonry from 'react-masonry-css'
import { FC, useMemo, useState } from 'react'
import 'yet-another-react-lightbox/styles.css'
import { PlusOutlined } from '@ant-design/icons'
import Lightbox from 'yet-another-react-lightbox'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import './index.less'
import styles from './index.module.less'
import Upload from '@/components/Upload'
import { upload } from '@/service/common'
import { MomentImage } from '@/service/timeline/types'

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
  onChange: (newList: MomentImage[]) => void
  momentId?: number
}
const Gallery: FC<GalleryProps> = ({ images, mode, onChange, momentId }) => {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const handleClick = ({ index }: { index: number }) => {
    setIndex(index)
    setOpen(true)
  }
  const { loading, runAsync } = useRequest(upload, { manual: true })
  const maxSort = useMemo(() => {
    if (images.length === 0) return 0

    return Math.max(...images.map((item) => item.sort))
  }, [images])

  const uploadButton = useMemo(() => {
    if (mode == 'edit')
      return (
        <Upload
          multiple
          listType="text"
          showFileList={false}
          onChange={(url) => {
            onChange(images.concat({ sort: maxSort + 1, src: url, momentId }))
          }}
          request={(file) => runAsync({ file })}
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
  }, [mode, maxSort, momentId, loading])
  return (
    <div className={styles.wrapper}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {uploadButton}

        {images.map((photo, index) => (
          <div key={index}>
            <LazyLoadImage
              src={photo.src}
              onClick={() => handleClick({ index })}
              style={{ cursor: 'pointer' }}
            />
          </div>
        ))}
      </Masonry>

      <Lightbox
        slides={images.map((props) => pick(['src'], props))}
        open={open}
        close={() => setOpen(false)}
        index={index}
      />
    </div>
  )
}

export default Gallery
