import { useParams } from 'react-router-dom'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Input, Space, Button, Switch, Tooltip } from 'antd'

import useAsync from '@/hooks/useAsync'
import styles from './index.module.less'
import ModalContent from './modalContent'
import { Editor } from '@/components/Markdown'
import useFormModal from '@/hooks/useFormModal'
import useEditOptions from '@/model/editOptions'
import { getArticleDetail } from '@/service/article'

const Index = () => {
  const { Modal, openModal } = useFormModal()
  const query = useParams()
  const { isPrivate, setPrivateMode } = useEditOptions()

  const id = Number(query.id)
  const { value, setValue } = useAsync(getArticleDetail, {
    params: { id: Number(id) },
    immediate: Boolean(id)
  })
  const { title, content } = value || {}

  const pushhArticle = () => {
    openModal({
      title: id ? '更新文章' : '发布文章',
      centered: true,
      content: <ModalContent data={value!} />
    })
  }

  const hancleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: title } = e.target

    setValue({ ...value!, title })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.row}>
          <Input
            value={title}
            placeholder="请输入文章标题"
            bordered={false}
            onChange={hancleChange}
          />
          <Button
            disabled={!title || !content}
            onClick={pushhArticle}
            type="primary"
          >
            发布
          </Button>
        </div>
        <div className={styles.control}>
          <Space align="center">
            <Switch
              className={styles.switch}
              checkedChildren="隐私编辑模式"
              unCheckedChildren="正常编辑模式"
              value={isPrivate}
              onChange={(checked) => {
                setPrivateMode?.(checked)
                if (checked) {
                  localStorage.setItem('private', 'true')
                } else {
                  localStorage.removeItem('private')
                }
              }}
            />
            <Tooltip title={<span>隐私编辑模式下,所有图片会被隐藏</span>}>
              <QuestionCircleOutlined />
            </Tooltip>
          </Space>
        </div>
      </div>

      <div className={styles.markdown}>
        <Editor
          value={content}
          onChange={(content) => setValue({ ...value!, content })}
        />
      </div>

      {Modal}
    </div>
  )
}

export default Index
