import 'animate.css'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { ConfigProvider } from 'antd'
import { useRoutes } from 'react-router-dom'
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import relativeTime from 'dayjs/plugin/relativeTime'

import './main.less'
import routers from './router'
import useTimeout from './hooks/useTimeout'
import { countWeb } from './service/common'
import BrowserRouter from './components/BrowserRouter'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
const Index = () => useRoutes(routers)

const App = () => {
  useTimeout(() => countWeb(), 5 * 1000, process.env.NODE_ENV === 'development')

  return (
    // <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#5CB963',
            colorFillContentHover: '#83D68C',
            colorLink: '#5CB963',
            colorLinkHover: '#83D68C'
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
