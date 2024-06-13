/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { Card } from '@mui/joy'
import classNames from 'classnames'
import { FC, useState } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'

import Image from '@/components/Image'

interface CardImageProps {
  src?: string
  // eslint-disable-next-line no-unused-vars
  onDelete?: (url: string) => boolean
  secure?: boolean
  [key: string]: any
}
const CardImage: FC<CardImageProps> = ({ src, onDelete, secure, ...props }) => {
  const [hidden, setHidden] = useState(false)

  return (
    <Card
      style={{ margin: '10px 0', position: 'relative' }}
      className={classNames('animate__animated', hidden && 'animate__rollOut')}
    >
      <Image {...props} src={src} key={src} secure={secure} />
      {onDelete && (
        <CloseCircleOutlined
          onClick={() => {
            if (src) {
              if (onDelete(src)) {
                setHidden(true)
              }
            }
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translate(-50%,-50%)'
          }}
        />
      )}
    </Card>
  )
}

export default CardImage
