import { isNil } from 'lodash'
import { useRequest } from 'ahooks'
import { useRef, useEffect } from 'react'
import { Spin, Input, Space, Button, Switch, Tooltip } from 'antd'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'

import { EditMode } from '../article'
import styles from './index.module.less'
import ModalContent from './modalContent'
import { Editor } from '@/components/Markdown'
import useFormModal from '@/hooks/useFormModal'
import useEditOptions from '@/model/editOptions'
import { Article } from '@/service/article/types'
import { useGoAuth, useNeedAuth } from '@/page/Auth'
import { history } from '@/components/BrowserRouter'
import { useHideContent } from '@/hooks/useHideContent'
import { getArticleDetail, isArticleNeedPwd } from '@/service/article'

export let unblock: () => void = () => void 0
const Index = () => {
  const { Modal, openModal } = useFormModal({ destroyOnClose: false })
  const query = useParams()
  const [params] = useSearchParams()
  const mode = params.get('mode') as EditMode
  const ref = useRef<Partial<Article>>(null)
  const { id } = query

  const { isPrivate, setPrivateMode } = useEditOptions()
  const { goAuth } = useGoAuth()
  const { key } = useNeedAuth({
    isNeed: () =>
      isNil(id) ? Promise.resolve(false) : isArticleNeedPwd({ id: Number(id) })
  })

  const {
    data: value,
    mutate: setValue,
    loading
  } = useRequest(getArticleDetail, {
    defaultParams: [{ id: Number(id), secureKey: key }],
    manual: !id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError(res: any) {
      if (res?.response?.code === 10001) goAuth()
    },
    onSuccess(data) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ref.current = data
    }
  })
  const { title, content } = value || {}

  const pushhArticle = () => {
    openModal({
      width: 600,
      title: id ? '更新文章' : '发布文章',
      centered: true,
      content: <ModalContent data={value!} />
    })
  }

  const hancleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: title } = e.target

    setValue({ ...value!, title })
  }

  useHideContent(!!content && !!title && !!id && mode === 'secure')
  useEffect(() => {
    // 新增时, 字段都为空, 则不拦截
    if (!id && !title && !content) return
    // // 编辑时, 若字段都未改变, 则不拦截
    if (id && content === ref.current?.content && title == ref.current?.title)
      return

    unblock = history.block((tx) => {
      openModal({
        title: '确认离开吗',
        content: <span>你编辑的信息未被保存, 离开页面后将会丢失</span>,
        onOk() {
          unblock()
          tx.retry()
        }
      })
    })
    return unblock
  }, [id, title, content])

  return (
    <Spin spinning={loading}>
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
          <div className={styles.secure_mode_text}>
            {mode === 'secure' && (
              <span>
                <InfoCircleOutlined style={{ marginRight: 4 }} />
                你当前处于加密编辑模式, 文本内容以及图片都会被加密处理,
                并且会开启安全密码访问, 可在
                <Link to="/manage/author" target="_blank">
                  用户管理
                </Link>
                处设置/修改安全密码
              </span>
            )}
          </div>
          <div className={styles.control}>
            <Space align="center">
              <Switch
                className={styles.switch}
                checkedChildren="隐私模式"
                unCheckedChildren="显示图片/视频"
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
              <Tooltip
                title={<span>隐私编辑模式下,所有图片/视频会被隐藏</span>}
              >
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
    </Spin>
  )
}

export default Index
