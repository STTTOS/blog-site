import { Divider } from '@mui/joy'
import { useRequest } from 'ahooks'
import { Space, Button, Dropdown } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import { FC, useMemo, useState, useEffect } from 'react'

import Gallery from '../Gallery'
import styles from './index.module.less'
import { Editor, Viewer } from '../Markdown'
import DateDisplay from '@/components/DateDisplay'
import { deleteMoment, updateMoment } from '@/service/timeline'
import { MomentImage, Moment as MomentType } from '@/service/timeline/types'

export type EditMode = 'edit' | 'view'
type MomentProps = {
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: number) => void
} & MomentType
const Moment: FC<MomentProps> = ({
  content,
  images,
  createdAt,
  id,
  onDelete
}) => {
  const [draft, setDraft] = useState<string>()
  const [mode, setMode] = useState<EditMode>('view')
  const [imgSet, setImageSet] = useState<MomentImage[]>([])
  const { runAsync: save, loading } = useRequest(updateMoment, { manual: true })
  const { runAsync: remove, loading: deleting } = useRequest(deleteMoment, {
    manual: true
  })

  const handleSave = async () => {
    await save({
      id,
      content: draft,
      images: imgSet
    })
    setMode('view')
  }

  const handleDelete = async () => {
    await remove({ id })
    onDelete(id)
  }
  useEffect(() => {
    setDraft(content)
  }, [content])

  useEffect(() => {
    setImageSet(images)
  }, [images])
  return (
    <div className={styles.wrapper}>
      <Dropdown
        menu={{
          items: [
            {
              label: (
                <Button
                  type="text"
                  style={{ padding: 0, width: 60 }}
                  onClick={() => setMode('edit')}
                >
                  编辑
                </Button>
              ),
              key: '1'
            },
            {
              label: (
                <Button
                  type="text"
                  style={{ padding: 0, width: 60 }}
                  onClick={handleDelete}
                  loading={deleting}
                >
                  删除
                </Button>
              ),
              key: '2'
            }
          ]
        }}
      >
        <MoreOutlined className={styles.more} />
      </Dropdown>
      <DateDisplay date={createdAt} className={styles.date} />

      <main>
        {mode === 'edit' && (
          <Space className={styles.op}>
            <Button type="link" onClick={handleSave} loading={loading}>
              保存
            </Button>
            <Button
              type="text"
              onClick={() => {
                setDraft(content)
                setMode('view')
                setImageSet(images)
              }}
            >
              取消
            </Button>
          </Space>
        )}

        {mode === 'edit' ? (
          <Editor value={draft} onChange={setDraft} style={{ height: 400 }} />
        ) : (
          <Viewer value={draft} />
        )}
        {mode === 'edit' && <Divider />}
        <Gallery
          mode={mode}
          momentId={id}
          onChange={setImageSet}
          images={[...imgSet].sort((a, b) => a.sort - b.sort)}
        />
      </main>
    </div>
  )
}

export default Moment
