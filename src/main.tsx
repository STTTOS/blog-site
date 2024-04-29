import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { ConfigProvider } from 'antd'
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
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#94b668',
            colorFillContentHover: '#90bb57',
            colorLink: '#94b668',
            colorLinkHover: '#90bb57'
          }
        }}
      >
        <Index />
      </ConfigProvider>
    </BrowserRouter>
    // </StrictMode>
  )
}

createRoot(document.getElementById('blog-app')!).render(<App />)
