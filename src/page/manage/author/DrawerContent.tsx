import type { IFormWithDrawer } from '@/hooks/useFormDrawer'
import type { ICreateFormConfig } from '@/utils/createForm/types'

import { SHA256 } from 'crypto-js'
import { useEffect, useCallback } from 'react'

import createForm from '@/utils/createForm'
import { User } from '@/service/user/types'
import { addUser, updateUser } from '@/service/user'
import { drawerFormComponents } from './staticModel'

type IProps = IFormWithDrawer & { data?: User }

const AuthorDrawerContent: React.FC<IProps> = ({
  register = () => void 0,
  data
}) => {
  const config: ICreateFormConfig = {
    formConfig: {
      layout: 'vertical',
      itemsRequire: false,
      data,
      initialValues: {
        avatar:
          '//www.wishufree.com/static/files/istockphoto-1389547625-612x612__5d084322-96f7-4099-bf55-89ff4befdf8e.jpg'
      }
    },
    components: drawerFormComponents(data ? 'edit' : 'add')
  }
  const { formStructure, form } = createForm(config)

  const handleFinish = useCallback(async () => {
    const { password, secureKey, ...rest }: Omit<User, 'id' | 'createdAt'> =
      await form.validateFields()
    const params = {
      password: password && SHA256(password).toString(),
      secureKey: secureKey && SHA256(secureKey).toString(),
      ...rest
    }

    if (data) {
      await updateUser({
        ...params,
        id: data.id
      })

      return
    }

    await addUser(params)
  }, [])

  // 向父组件的提交按钮, 注册`handleFinish`
  useEffect(() => {
    register(handleFinish)
  }, [register, handleFinish])

  return <div>{formStructure}</div>
}

export default AuthorDrawerContent
