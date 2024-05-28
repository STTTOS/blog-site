import { pick } from 'ramda'
import { FC, useState } from 'react'
import Masonry from 'react-masonry-css'
import 'yet-another-react-lightbox/styles.css'
import Lightbox from 'yet-another-react-lightbox'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import './index.less'

const breakpointColumnsObj = {
  default: 4,
  1700: 3,
  1300: 2,
  500: 1
}
const images = [
  {
    src: 'https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg'
  },
  {
    src: 'https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg'
  },
  {
    src: 'https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg'
  }
]
interface GalleryProps {
  images: Array<{ src: string }>
}
const Gallery: FC<GalleryProps> = () => {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const handleClick = ({ index }: { index: number }) => {
    setIndex(index)
    setOpen(true)
  }
  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
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
