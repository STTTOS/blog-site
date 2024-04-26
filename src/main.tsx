import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRoutes, BrowserRouter } from 'react-router-dom'

import './main.less'
import routers from './router'
import useTimeout from './hooks/useTimeout'
import { countWeb } from './service/common'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
const Index = () => useRoutes(routers)

const App = () => {
  useTimeout(() => countWeb(), 5 * 1000, process.env.NODE_ENV === 'development')

  return (
    <StrictMode>
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    </StrictMode>
  )
}

createRoot(document.getElementById('blog-app')!).render(<App />)
