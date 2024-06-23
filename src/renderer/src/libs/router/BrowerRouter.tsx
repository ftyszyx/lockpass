import Router from './Router'
import { createBrowserHistory } from './history'
import { BrowerRouterProps } from './index'

export default function BrowerRouter(props: BrowerRouterProps) {
  const history = createBrowserHistory({ debug: props.debug })
  return (
    <Router history={history} debug={props.debug || false}>
      {props.children}
    </Router>
  )
}
