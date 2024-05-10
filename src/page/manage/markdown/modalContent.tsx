import type { Article } from '@/service/article/types'
import type { IFormWithDrawer } from '@/hooks/useFormDrawer'
import type { ICreateFormConfig } from '@/utils/createForm/types'

import { useNavigate } from 'react-router-dom'
import { useMemo, useEffect, useCallback } from 'react'

import { unblock } from '.'
import { useUserInfo } from '@/model'
import createForm from '@/utils/createForm'
import { modelComponents } from './staticModel'
import useGlobalData from '@/hooks/useGlobalData'
import { addArticle, updateArticle } from '@/service/article'

type IProps = IFormWithDrawer & { data: Article }

const ModalContent: React.FC<IProps> = ({ register = () => void 0, data }) => {
  const navigate = useNavigate()
  const { user } = useUserInfo()
  const { userOptions, tagOptions, refreshTags, fecthingTag, fetchingUser } =
    useGlobalData()
  const isEditing = !!data.id

  const defaultData = useMemo(
    () => ({
      ...data,
      coAuthorIds: data?.coAuthorIds?.split(',').map(Number)
    }),
    [data]
  )
  const config: ICreateFormConfig = {
    formConfig: {
      disabled: isEditing && user?.id !== data.authorId,
      labelCol: {
        span: 4
      },
      data: defaultData
    },
    components: modelComponents(
      userOptions,
      tagOptions,
      refreshTags,
      fecthingTag,
      fetchingUser
    )
  }
  const { formStructure, form } = createForm(config)

  const handleFinish = useCallback(async () => {
    const res = await form.validateFields()
    const params = { ...data, ...res }

    if (isEditing) {
      await updateArticle(params)
    } else {
      await addArticle(params)
    }

    unblock()
    navigate('/manage/article')
  }, [data])

  // 向父组件的提交按钮, 注册`handleFinish`
  useEffect(() => {
    register(handleFinish)
  }, [register, handleFinish])

  return formStructure
}

export default ModalContent
