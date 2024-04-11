import { useRequest } from 'ahooks'

import { getAllTag } from '@/service/tag'
import { getAllUser } from '@/service/user'

const useGlobalData = () => {
  const { data: users = [] } = useRequest(getAllUser)
  const { data: tags = [], runAsync: refreshTags } = useRequest(getAllTag)

  return {
    userOptions: users.map(({ id, name }) => ({ label: name, value: id })),
    tagOptions: tags.map(({ id, name }) => ({ label: name, value: id })),
    refreshTags
  }
}

export default useGlobalData
