import type { FC } from "react"
import type { Comment } from '@/service/comments/types'

import styles from './index.module.less'
import { Avatar } from "antd"

const SubReply: FC<Pick<Comment, 'id' | 'avatar' | 'content' | 'createdAt' | 'isContributor' | 'name'>> =
 ({ content, avatar, name, createdAt, isContributor }) => {
   return (
     <div className={styles.container}>
       <Avatar src={avatar} className={styles.avatar} />
       <div className={styles.main}>
         <div className={styles['user-info']}>
           <span className={styles.name}>{name}</span>
           {isContributor && <em className={styles.contributor}>contributor</em>}
         </div>
         <span className={styles.content}>{content}</span>
         <div className={styles.extra}>
           <span className={styles.time}>{createdAt}</span>
         </div>
       </div>
     </div>
   )
 }
export default SubReply