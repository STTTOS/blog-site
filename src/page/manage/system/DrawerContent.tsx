import type { IFormWithDrawer } from '@/hooks/useFormDrawer'
import type { ICreateFormConfig } from '@/utils/createForm/types'

import { useEffect, useCallback } from 'react'

import createForm from '@/utils/createForm'
import { sendNotify } from '@/service/system'

type IProps = IFormWithDrawer

const SystemDrawerContent: React.FC<IProps> = ({ register = () => void 0 }) => {
  const config: ICreateFormConfig = {
    formConfig: {
      layout: 'vertical',
      itemsRequire: true
    },
    components: [
      { label: '内容', name: 'content' },
      { label: '跳转链接', name: 'link' }
    ]
  }
  const { formStructure, form } = createForm(config)

  const handleFinish = useCallback(async () => {
    const values = await form.validateFields()
    await sendNotify(values)
  }, [])

  // 向父组件的提交按钮, 注册`handleFinish`
  useEffect(() => {
    register(handleFinish)
  }, [register, handleFinish])

  return <div>{formStructure}</div>
}

export default SystemDrawerContent
