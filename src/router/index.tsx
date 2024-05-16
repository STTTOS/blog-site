import type { RouteObject } from 'react-router-dom'
import type { FC, LazyExoticComponent } from 'react'

import { lazy } from 'react'
import { join } from 'path-browserify'

import Layout from '../layout'
import Home from '@/page/client/home'
import LayoutClient from '../layoutClient'
import Article from '@/page/manage/article'
import withTitleAndRedirect from '@/Hoc/withTitleAndRedirect'

export interface MyRoute
  extends Omit<RouteObject, 'children' | 'element' | 'index'> {
  element?: LazyExoticComponent<() => JSX.Element> | FC
  title?: string
  children?: MyRoute[]
  redirect?: string
}
// const a = lazy(() => import('@/layout'))
/**
 * 路由配置
 * @see http://react-guide.github.io/react-router-cn/docs/guides/basics/RouteConfiguration.html
 */
const routers: MyRoute[] = [
  {
    path: '/403',
    element: lazy(() => import('@/page/403'))
  },
  {
    path: '/404',
    element: lazy(() => import('@/page/404'))
  },
  {
    path: '/500',
    element: lazy(() => import('@/page/500'))
  },
  {
    path: '/auth/:id',
    element: lazy(() => import('@/page/Auth'))
  },
  {
    path: '/manage',
    element: Layout,
    children: [
      {
        path: 'author',
        element: lazy(() => import('@/page/manage/author')),
        title: '作者管理'
      },
      {
        path: 'tag',
        element: lazy(() => import('@/page/manage/tag')),
        title: '标签管理'
      },
      {
        path: 'article',
        title: '文章管理',
        children: [
          {
            path: 'list',
            element: Article,
            title: '文章列表'
          },
          {
            path: 'recycle',
            element: lazy(() => import('@/page/manage/article/recycle')),
            title: '回收站'
          },
          {
            path: '*',
            redirect: 'list'
          }
        ]
      },
      {
        path: 'tool',
        element: lazy(() => import('@/page/manage/tool')),
        title: '工具管理'
      },
      {
        path: 'ebook',
        element: lazy(() => import('@/page/manage/ebook')),
        title: '电子书管理'
      },
      {
        path: 'system',
        element: lazy(() => import('@/page/manage/system')),
        title: '系统管理'
      },
      {
        path: 'markdown',
        element: lazy(() => import('@/page/manage/markdown')),
        title: '新增文章'
      },
      {
        path: 'markdown/:id',
        element: lazy(() => import('@/page/manage/markdown')),
        title: '编辑文章'
      },
      {
        path: 'storage',
        element: lazy(() => import('@/page/manage/storage')),
        title: '文件存储'
      },
      {
        path: '*',
        redirect: '/article/list'
      }
    ]
  },
  {
    path: '/',
    element: LayoutClient,
    children: [
      {
        path: '/',
        element: Home
      },
      {
        path: 'article/:id',
        element: lazy(() => import('@/page/client/article'))
      },
      {
        path: 'article/list',
        element: lazy(() => import('@/page/client/articleList'))
      },
      {
        path: 'tag',
        element: lazy(() => import('@/page/client/tag'))
      }
    ]
  },
  {
    path: '/tools/:id',
    element: lazy(() => import('@/page/tools'))
  },
  {
    path: '/login',
    element: lazy(() => import('@/page/login'))
  },
  {
    path: '/person',
    element: lazy(() => import('@/page/client/person'))
  },
  {
    path: '*',
    redirect: '/'
  }
]

function format(routers: MyRoute[], basePath = ''): RouteObject[] {
  const result = routers.map(
    ({ path, children, element, redirect, title = '木木记', ...rest }) => {
      const nextPath = join(basePath, path || '')

      // 如果element不存在, 则将子元素铺平
      if (!element && children) {
        return children.map((item) => ({
          ...item,
          // 组合父级route path & 子路由path
          path: join(path || '', item.path || ''),
          element: withTitleAndRedirect({ basePath: nextPath, ...item }),
          children: item.children && format(item.children, nextPath)
        }))
      }

      return {
        ...rest,
        path,
        children: children && format(children, nextPath),
        element: withTitleAndRedirect({
          title,
          basePath,
          redirect,
          element
        })
      }
    }
  )
  return result.flat(5)
}
export default format(routers)
