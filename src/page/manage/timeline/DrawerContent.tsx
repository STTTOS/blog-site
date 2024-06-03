import type { IFormWithDrawer } from '@/hooks/useFormDrawer'
import type { ICreateFormConfig } from '@/utils/createForm/types'

import { useEffect, useCallback } from 'react'

import createForm from '@/utils/createForm'
import { updateTimeline } from '@/service/timeline'
import { Timeline } from '@/service/timeline/types'
import { drawerFormComponents } from './staticModel'

type IProps = IFormWithDrawer & { data: Timeline }

const TimelineDrawerContent: React.FC<IProps> = ({
  register = () => void 0,
  data
}) => {
  const config: ICreateFormConfig = {
    formConfig: {
      layout: 'vertical',
      itemsRequire: false,
      data
    },
    components: drawerFormComponents
  }
  const { formStructure, form } = createForm(config)

  const handleFinish = useCallback(async () => {
    const values: Timeline = await form.validateFields()

    await updateTimeline({
      ...values,
      id: data.id
    })
  }, [data])

  // 向父组件的提交按钮, 注册`handleFinish`
  useEffect(() => {
    register(handleFinish)
  }, [register, handleFinish])

  return <div>{formStructure}</div>
}

export default TimelineDrawerContent
