import type { MyRoute } from '../router/index'

import { join } from 'path-browserify'
import { useMemo, Suspense, useEffect } from 'react'

import Loading from '@/components/Loading'
import Redirect from '@/components/Redirect'

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
    }, [title])

    const children = useMemo(() => {
      if (redirect) {
        return <Redirect to={join(basePath, redirect)} />
      }
      if (Element)
        return (
          <Suspense fallback={<Loading />}>
            <Element />
          </Suspense>
        )
      return null
    }, [redirect, Element, basePath])

    return children
  }
  return <NewCmp />
}

export default withTitleAndRedirect
