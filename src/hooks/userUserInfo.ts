import useAsync from './useAsync'
import { getUser } from '@/service/user'
import { useRequest } from 'ahooks'

function useUserInfo() {
  const { data, loading } = useRequest(getUser)

  return { user: data, loading }
}

export default useUserInfo
