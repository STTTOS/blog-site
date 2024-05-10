import React from 'react'
import { createBrowserHistory } from 'history'
import {
  Router,
  BrowserRouterProps as NativeBrowserRouterProps
} from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BrowserRouterProps
  extends Omit<NativeBrowserRouterProps, 'window'> {}

export const history = createBrowserHistory()
const BrowserRouter: React.FC<BrowserRouterProps> = React.memo((props) => {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location
  })

  React.useLayoutEffect(() => history.listen(setState), [history])

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  )
})
export default BrowserRouter
