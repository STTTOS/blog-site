import dayjs from 'dayjs'
import classNames from 'classnames'
import React, { FC, useMemo } from 'react'

import styles from './index.module.less'

interface DateProps {
  date?: string
  className?: string
}
const DateDisplay: FC<DateProps> = ({ date, className }) => {
  const [month, day] = useMemo(() => {
    const time = dayjs(date)
    const [month, day] = [time.get('month') + 1, time.get('D')]
    return [month, [0, day].join('').slice(-2)]
  }, [date])
  return (
    <div className={classNames(styles.wrapper, className)}>
      <span className={styles.day}>{day}</span>
      <span className={styles.month}>{month}月</span>
    </div>
  )
}

export default DateDisplay
