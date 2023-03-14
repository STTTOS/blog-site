import type { FC } from 'react'

import { useState } from 'react'
import { Button } from 'antd'
import JsFileDownloader from 'js-file-downloader'

const DownloadButton: FC<{ text: string, url: string; }> = ({ text, url }) => {

  const [loading, setLoading] = useState(false)

  const handleDownload = () => {
    setLoading(true)
    new JsFileDownloader({ url }).finally(() => setLoading(false))
  }

  return <Button type="link" onClick={handleDownload} loading={loading}>{text}</Button>
}

export default DownloadButton