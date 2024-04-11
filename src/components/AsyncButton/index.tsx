import type { FC } from 'react'

import { useRequest } from 'ahooks'
import { Button, ButtonProps } from 'antd'

export interface AsyncButtonProps extends ButtonProps {
  request: () => Promise<unknown>
}
const AsyncButton: FC<AsyncButtonProps> = ({ request, children, ...props }) => {
  const { loading, runAsync } = useRequest(request, { manual: true })

  return (
    <Button {...props} onClick={runAsync} loading={loading}>
      {children}
    </Button>
  )
}

export default AsyncButton
