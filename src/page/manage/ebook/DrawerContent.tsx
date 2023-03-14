import type { Ebook } from '@/service/ebook/types'
import type { IFormWithDrawer } from '@/hooks/useFormDrawer'
import type { ICreateFormConfig } from '@/utils/createForm/types'

import { useEffect, useCallback } from 'react'

import createForm from '@/utils/createForm'
import { drawerFormComponents } from './staticModel'
import { addEbook, updateEbook } from '@/service/ebook'

type IProps = IFormWithDrawer & { data?: Ebook }

const EbookDrawerContent: React.FC<IProps> = ({
  register = () => void 0,
  data
}) => {
  const config: ICreateFormConfig = {
    formConfig: {
      data,
      layout: 'vertical',
      itemsRequire: true
    },
    components: drawerFormComponents
  }
  const { formStructure, form } = createForm(config)

  const handleFinish = useCallback(async () => {
    const Ebook: Omit<Ebook, 'id'> = await form.validateFields()

    if (data) {
      await updateEbook({ ...Ebook, id: data.id })
      return
    }

    await addEbook(Ebook)
  }, [])

  // 向父组件的提交按钮, 注册`handleFinish`
  useEffect(() => {
    register(handleFinish)
  }, [register, handleFinish])

  return <div>{formStructure}</div>
}

export default EbookDrawerContent
