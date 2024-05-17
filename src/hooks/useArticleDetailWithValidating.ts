import { useRequest } from 'ahooks'

import { useGoAuth, sessionSecurekey } from '@/page/Auth'
import { getArticleDetail, isArticleNeedPwd } from '@/service/article'

async function getData(id: number, onNav: () => void) {
  const isNeedPwd = await isArticleNeedPwd({ id })
  const secureKey = sessionStorage.getItem(sessionSecurekey)
  if (isNeedPwd && !secureKey) {
    onNav()
    return null
  }
  return getArticleDetail({ id, secureKey })
}
const useArticleDetailWithValidating = (
  id?: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
  onSuccess?: (data: any) => void
) => {
  const { goAuth } = useGoAuth()
  const {
    data: detail,
    loading,
    mutate
  } = useRequest(getData, {
    defaultParams: [id!, goAuth],
    manual: !id,
    onSuccess,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError(res: any) {
      if (res?.response?.code === 10001) goAuth()
    }
  })
  return {
    loading,
    data: detail,
    setValue: mutate
  }
}
export default useArticleDetailWithValidating
