/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormInstance } from 'antd'
import type { IFormItemProps } from '@/utils/createForm/types'

export type CurrentStatus = 'folded' | 'unfolded'

export interface SearchBarProps<T = any> {
  loading?: boolean
  form?: FormInstance<T>
  onReset?: () => unknown
  fields: IFormItemProps<T>[]
  countEveryLine?: 2 | 3 | 4 | 6
  initialValues?: Record<string, unknown>
  buttonPosition?: 'left' | 'center' | 'right'
  // eslint-disable-next-line no-unused-vars
  onSearch?: (val: Record<string, any>) => unknown
}
