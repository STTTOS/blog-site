import type { Tag as TagType } from '@/service/tag/types'

import dayjs from 'dayjs'
import classnames from 'classnames'
import { useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tag, Card, Avatar, Tooltip, Skeleton } from 'antd'
import { EyeOutlined, MailOutlined, GithubOutlined } from '@ant-design/icons'

import { useUserInfo } from '@/model'
import useAsync from '@/hooks/useAsync'
import styles from './index.module.less'
import Avatars from '@/components/Avatars'
import useTimeout from '@/hooks/useTimeout'
import { getUserCard } from '@/service/user'
import Comments from '@/components/Comments'
import ThreeColLayout from './ThreeColLayout'
import randomTagColor from '@/utils/randomTagColor'
import ScrollBarNav from '@/components/ScrollBarNav'
import { Viewer, Catalogue } from '@/components/Markdown'
import {
  countArticle,
  getArticleDetail,
  getSimilarArticles
} from '@/service/article'

const Index: React.FC = () => {
  const navigate = useNavigate()
  const query = useParams()

  const id = Number(query.id)
  const { value: detail, loading } = useAsync(getArticleDetail, {
    params: { id }
  })
  const { value: recommendList = [] } = useAsync(getSimilarArticles, {
    params: { id }
  })
  const {
    value: authorInfo,
    execute: getUserCardData,
    loading: userLoading
  } = useAsync(getUserCard, { immediate: false })
  const { fetch, user } = useUserInfo()

  const {
    title,
    content,
    authorId,
    tags = [],
    isOrigin,
    viewCount,
    updatedAt,
    createdAt,
    readingTime,
    backgroundUrl,
    desc: articleDesc,
    private: isPrivate
  } = detail || {}
  const { avatar, desc, github, email, name, totalViewCount } = authorInfo || {}

  const updateDateFromNow = useMemo(() => {
    return dayjs(updatedAt).fromNow()
  }, [updatedAt])
  const renderTags = (tags: TagType[]) =>
    tags.map(({ name, id }) => (
      <Tag
        key={name}
        className={styles.tag}
        color={randomTagColor()}
        onClick={() => navigate(`/article/list?tagId=${id}`)}
      >
        {name}
      </Tag>
    ))

  useEffect(() => {
    if (!authorId) return
    getUserCardData({ id: authorId })
  }, [authorId])

  useTimeout(
    () => countArticle({ id }),
    8 * 1000,
    process.env.NODE_ENV === 'development'
  )
  useEffect(() => {
    fetch('client')
  }, [])
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.bar}
        style={{ width: detail ? '100%' : undefined }}
      />

      <ThreeColLayout
        main={
          <Skeleton title active loading={loading} paragraph={{ rows: 16 }}>
            <div className={styles.article}>
              <div className={styles.header}>
                <div className={classnames(styles.title, 'text-ellipsis')}>
                  {title}
                  <span className={styles.articleType}>
                    {isOrigin ? '原创' : '转载'}
                  </span>
                  <span className={styles.private}>
                    {isPrivate ? '私密' : '公开'}
                  </span>
                </div>

                <div className={styles.subTitle}>
                  {articleDesc && <div>{articleDesc}</div>}
                </div>

                <div
                  className={classnames(
                    styles.info,
                    styles.light_color,
                    styles.set_margin_to_children
                  )}
                >
                  <span>
                    {createdAt}(上次修改: {updateDateFromNow})
                  </span>
                  <span>浏览次数:{viewCount}</span>
                  <i className={styles.readingTime}>{readingTime}分钟</i>
                </div>

                <div className="text-right">{renderTags(tags)}</div>

                {backgroundUrl && (
                  <img src={backgroundUrl} className={styles.cover} />
                )}
              </div>

              <Viewer value={content} />
            </div>

            {isPrivate && <Avatars artcileId={id} />}

            <Comments articleId={id} avatar={user?.avatar} />
          </Skeleton>
        }
        left={
          <Skeleton active loading={loading}>
            <div className={styles.catalogue}>
              <Catalogue value={content} />
            </div>
          </Skeleton>
        }
        right={
          <Skeleton avatar loading={userLoading && !!authorId}>
            {authorId && (
              <Card className={styles.user}>
                <div className="flex">
                  <Avatar src={avatar} className={styles.avatar} />

                  <div className={styles.user_right}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.light_color}>{desc}</div>
                  </div>
                </div>

                {/* 邮箱以及git */}
                {(github || email) && (
                  <div
                    className={classnames(
                      styles.icons,
                      styles.set_margin_to_children
                    )}
                  >
                    <a href={github} target="_blank">
                      <GithubOutlined />
                    </a>
                    <Tooltip title={email}>
                      <MailOutlined />
                    </Tooltip>
                  </div>
                )}

                <div className={classnames(styles.count_line, 'flex')}>
                  <EyeOutlined className={styles.count_icon} />
                  <span>文章浏览次数: {totalViewCount?.toLocaleString()}</span>
                </div>
              </Card>
            )}

            <Card title="相关推荐" className={styles.similar}>
              {recommendList.map(({ viewCount, readingTime, title, id }) => (
                <div className={styles.similar_item} key={id}>
                  <a target="_blank" href={`/article/${id}`}>
                    {title}
                  </a>

                  <div
                    className={classnames(
                      styles.bottom,
                      styles.light_color,
                      styles.set_margin_to_children
                    )}
                  >
                    <span>浏览次数:{viewCount.toLocaleString()}</span>
                    <i className={styles.readingTime}>{readingTime}分钟</i>
                  </div>
                </div>
              ))}
            </Card>
          </Skeleton>
        }
      />
      <ScrollBarNav />
    </div>
  )
}

export default Index
