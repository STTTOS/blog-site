import { FC, useEffect } from 'react'

import { useUserInfo } from '@/model'
import Loading from '@/components/Loading'
import Redirect from '@/components/Redirect'

const withLoginCheck = (Comp: FC) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (props: any) => {
    const { loading, fetch: fetchUseringInfo, user } = useUserInfo()

    useEffect(() => {
      fetchUseringInfo()
    }, [])

    if (loading) return <Loading />
    if (!user) return <Redirect to="/login" />
    return <Comp {...props} />
  }
}

export default withLoginCheck
