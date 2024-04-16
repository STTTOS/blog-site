import { useRequest } from 'ahooks'

import { getAllTag } from '@/service/tag'
import { getAllUser } from '@/service/user'

const useGlobalData = () => {
  const { data: users = [], loading: fetchingUser } = useRequest(getAllUser)
  const {
    data: tags = [],
    runAsync: refreshTags,
    loading: fecthingTag
  } = useRequest(getAllTag)

  return {
    userOptions: users.map(({ id, name }) => ({ label: name, value: id })),
    tagOptions: tags.map(({ id, name }) => ({ label: name, value: id })),
    refreshTags,
    fetchingUser,
    fecthingTag
  }
}

export default useGlobalData
