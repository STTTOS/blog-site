import type { MyRoute } from '../router/index'

import { useEffect, Suspense } from 'react'

import Redirect from '@/components/Redirect'
import Loading from '@/components/Loading'

type Props = Pick<MyRoute, 'element' | 'title' | 'redirect'> & {
  basePath: string
}

function withTitleAndRedirect({
  title,
  redirect,
  basePath,
  element: Element = () => null
}: Props) {
  const NewCmp = () => {
    // 设置标题
    useEffect(() => {
      if (title) {
        document.title = title
      }
    }, [])

    return redirect ? <Redirect to={basePath + redirect} /> : (
      <Suspense fallback={<Loading />}>
        <Element />
      </Suspense>
    )
  }
  return <NewCmp />
}

export default withTitleAndRedirect
