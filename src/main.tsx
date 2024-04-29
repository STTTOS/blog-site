import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useRoutes } from 'react-router-dom'
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserHistory } from 'history'
import relativeTime from 'dayjs/plugin/relativeTime'

import './main.less'
import routers from './router'
import useTimeout from './hooks/useTimeout'
import { countWeb } from './service/common'
import { BrowserRouter } from './components/BrowserRouter'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
const Index = () => useRoutes(routers)

export const history = createBrowserHistory()
const App = () => {
  useTimeout(() => countWeb(), 5 * 1000, process.env.NODE_ENV === 'development')

  return (
    // <StrictMode>
    <BrowserRouter history={history}>
      <Index />
    </BrowserRouter>
    // </StrictMode>
  )
}

createRoot(document.getElementById('blog-app')!).render(<App />)
