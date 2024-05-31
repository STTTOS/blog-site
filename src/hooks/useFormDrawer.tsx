import type { DrawerProps } from 'antd'
import type { ReactElement } from 'react'

import { Space, Drawer, Button } from 'antd'
import { useRef, Fragment, useState, cloneElement } from 'react'

interface IOpenDrawer
  extends Omit<
    DrawerProps,
    'visible' | 'onCancel' | 'onOk' | 'confirmLoading'
  > {
  content: ReactElement
  refresh?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
  onOk?: (values: Record<string, any>) => void
}

type CallBack = () => Promise<any>
export interface IFormWithDrawer {
  // eslint-disable-next-line no-unused-vars
  register?: (fn: CallBack) => void
}

const useFormDrawer = (config?: Partial<IOpenDrawer>) => {
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [drawerProps, setDrawerProps] = useState<IOpenDrawer>({
    ...config,
    content: <Fragment />
  })
  const callbackRef = useRef<CallBack>(() => Promise.resolve(true))

  const { content, refresh = () => void 0, onOk, ...rest } = drawerProps

  const closeDrawer = () => setVisible(false)

  const openDrawer = (props?: IOpenDrawer) => {
    setDrawerProps({ ...drawerProps, ...props })
    setVisible(true)
  }

  const handleOk = async () => {
    try {
      setConfirmLoading(true)
      const values = await callbackRef.current?.call(null)
      onOk?.(values)
      closeDrawer()
      refresh()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error:', (error as Error).message)
    } finally {
      setConfirmLoading(false)
    }
  }

  const Footer = (
    <div style={{ textAlign: 'right' }}>
      <Space>
        <Button onClick={closeDrawer}>取消</Button>
        <Button type="primary" loading={confirmLoading} onClick={handleOk}>
          确定
        </Button>
      </Space>
    </div>
  )

  const AntdDrawer = (
    <Drawer
      width={600}
      destroyOnClose
      visible={visible}
      footer={Footer}
      closable={false}
      onClose={() => setVisible(false)}
      {...rest}
    >
      {cloneElement(content, {
        register: (fn: CallBack) => {
          callbackRef.current = fn
        }
      })}
    </Drawer>
  )

  return {
    Drawer: AntdDrawer,
    closeDrawer,
    openDrawer
  }
}

export default useFormDrawer
