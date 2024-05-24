import { FC } from 'react'
import Card from '@mui/joy/Card'
import CardCover from '@mui/joy/CardCover'

interface VideoProps {
  src?: string
}
const Video: FC<VideoProps> = ({ src }) => {
  return (
    <Card component="li" style={{ width: '100%', paddingTop: '56.25%' }}>
      <CardCover>
        <video
          controls
          width="100%"
          height="100%"
          poster="//www.wishufree.com/static/files/alexander-shatov-niUkImZcSP8-unsplash__8ece746d-a187-40b2-98a8-b00254380ffc.jpg"
        >
          <source src={src} />
        </video>
      </CardCover>
    </Card>
  )
}

export default Video
