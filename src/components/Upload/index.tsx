/* eslint-disable @typescript-eslint/no-non-null-assertion */
// 统一封装上传接口
// 1. 支持多图片模式, 默认以 , 分割
import type { RcFile } from 'antd/es/upload'
import type { FileListItem, IUploadProps } from './types'
import type { UploadFile } from 'antd/lib/upload/interface'
import type { UploadRequestOption } from 'rc-upload/lib/interface'

import path from 'path-browserify'
import { propEq, complement } from 'ramda'
import React, { useState, useEffect } from 'react'
import { Modal, Upload, Button, message } from 'antd'
import {
  PlusOutlined,
  UploadOutlined,
  LoadingOutlined
} from '@ant-design/icons'

import useAsync from '@/hooks/useAsync'
import switchRender from '@/utils/switchRender'
import {
  getFileType,
  convertFileListToUrl,
  convertUrlToFileList
} from './methods'

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const Index: React.FC<IUploadProps> = ({
  maxSize,
  value = '',
  limitWidth,
  limitHeight,
  minSize = 0,
  maxCount = 1,
  uploadText = '上传',
  showValue = false,
  showFileList = true,
  onChange = () => void 0,
  accept = 'jpg,png,jpeg',
  request = async () => '',
  listType = 'picture-card',
  uploadButtonText = '点击上传',
  ...rest
}) => {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const [fileList, setFileList] = useState<FileListItem[]>([])
  const { execute: submit, loading } = useAsync(request, { immediate: false })
  const showDisabled = loading || showValue

  const handleCancel = () => setPreviewVisible(false)

  const handlePreview = async (file: UploadFile) => {
    // 仅预览图片
    if (!['.png', '.jpg', '.jpeg'].includes(path.extname(file.url!))) {
      const anchor = document.createElement('a')
      anchor.target = '_blank'
      anchor.href = file.url!
      anchor.click()
      return
    }
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewVisible(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    )
  }

  const imageWidthAndHeightLimit = (
    file: File,
    limitWidth?: number,
    limitHeight?: number
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
        const img = new Image()
        img.src = reader.result as string

        img.onload = () => {
          const [error, res] = (() => {
            if (
              limitWidth &&
              limitHeight &&
              img.width !== limitWidth &&
              img.height !== limitHeight
            )
              return [`请上传宽高等于${limitWidth}*${limitHeight}的图片`, false]

            if (limitWidth && img.width !== limitWidth)
              return [`请上传宽度等于${limitWidth}的图片`, false]

            if (limitHeight && img.height !== limitHeight)
              return [`请上传高度等于${limitHeight}的图片`, false]

            return [null, true]
          })()

          if (error) {
            message.error(error)
            reject(error)
          } else {
            resolve(res)
          }
        }
      }
    })
  }

  const beforeUpload = async (file: File) => {
    const { name, size, type } = file
    const fileType = getFileType(name)

    if (accept === '*') return true
    else if (!accept.includes(fileType!)) {
      message.error(`只能上传${accept}类型的文件`)
      return false
    }

    // 将文件大小转化为Kb
    const fileSize = size / 1024
    if (fileSize < minSize) {
      message.error(`文件大小至少为${minSize}Kb`)
      return false
    }
    if (maxSize && fileSize > maxSize) {
      message.error(`文件大小不能超过${maxSize}Kb`)
      return false
    }

    if (type.startsWith('image') && (limitWidth || limitHeight)) {
      const res = await imageWidthAndHeightLimit(file, limitWidth, limitHeight)
      return res
    }

    return true
  }

  const handleRemove = ({ url = '' }: UploadFile) => {
    const newList = fileList.filter(complement(propEq('url', url)))
    const newUrl = convertFileListToUrl(newList)

    setFileList(newList)
    onChange(newUrl)
  }

  const handleCustomRequest = async ({ file }: UploadRequestOption) => {
    const { name } = file as File
    const url = await submit(file as File)

    const newList = fileList
      .concat({
        name,
        url,
        uid: url
      })
      .slice(-maxCount)
    const newUrl = convertFileListToUrl(newList.slice(-maxCount))
    setFileList(newList)
    onChange(newUrl)
  }

  const textButton = (
    <Button icon={<UploadOutlined />} loading={loading}>
      {uploadButtonText}
    </Button>
  )

  const pictureButton = switchRender(
    <div>
      <LoadingOutlined />
      <div>上传中...</div>
    </div>,
    <div>
      <p>
        <PlusOutlined />
      </p>
      <span>{uploadText}</span>
    </div>,
    loading
  )

  useEffect(() => {
    if (!value || fileList.length > 0) return

    setFileList(convertUrlToFileList(value))
  }, [value])
  return (
    <>
      <Upload
        {...rest}
        showUploadList
        listType={listType}
        disabled={showDisabled}
        onRemove={handleRemove}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        customRequest={handleCustomRequest}
        fileList={showFileList ? fileList : []}
      >
        {!showValue &&
          switchRender(pictureButton, textButton, listType === 'picture-card')}
      </Upload>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}
export default Index
