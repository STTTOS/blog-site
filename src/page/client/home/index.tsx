import type { FC } from 'react'

import { Avatar } from 'antd'
import classnames from 'classnames'
import ParticlesBg from 'particles-bg'
import { useNavigate } from 'react-router-dom'
import { GithubOutlined } from '@ant-design/icons'

import Box3D from '@/components/Box3D'
import Footer from '@/components/Footer'
import styles from './index.module.less'
import randomInt from '@/utils/randomInt'
import useAsync from '../../../hooks/useAsync'
import { getUsersByRecommend } from '@/service/user'

const Index: FC = () => {
  const navigate = useNavigate()
  const { value: users = [] } = useAsync(getUsersByRecommend)

  return (
    <div className={styles.wrapper}>
      <ParticlesBg bg type="lines" />

      <div className={classnames(styles.header, 'text-center')}>
        <span className={styles.to_all} onClick={() => navigate('/tag')}>
          浏览总站
        </span>
      </div>

      <div className={styles.users}>
        {users.map(
          ({
            avatar,
            name,
            github,
            desc,
            id,
            totalViewCount,
            backgroundUrl,
            isContributor
          }) => (
            <Box3D
              key={id}
              size={240}
              animation
              className={styles.user}
              onClick={() => navigate(`/tag?authorId=${id}`)}
              style={{
                margin: `${randomInt(100, 160)}px ${randomInt(80, 120)}px`,
                float: Math.random() < 0.5 ? 'left' : 'right'
              }}
              text={{
                forward: {
                  children: (
                    <div>
                      <Avatar src={avatar} className={styles.avatar} />
                      <div className={styles.name}>{name}</div>

                      <div className={styles.extra}>
                        <span>总浏览次数:</span>
                        <span className={styles.total}>
                          {totalViewCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                },
                right: {
                  children: <span className={styles.desc}>{desc}</span>
                },
                up: {
                  children: github && (
                    <a
                      href={github}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GithubOutlined className={styles.github} />
                    </a>
                  )
                },
                left: {
                  children: isContributor && (
                    <em className={styles.contributor}>Contributor</em>
                  )
                },
                back: {
                  children: backgroundUrl && (
                    <img src={backgroundUrl} className={styles.background} />
                  )
                }
              }}
            />
          )
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Index
