import { HashRouteProps } from '.'
import { createHashHistory } from './history'
import Router from './Router'

export default function HashRouter(props: HashRouteProps) {
  const history = createHashHistory({ debug: props.debug })
  return (
    <Router history={history} debug={props.debug || false}>
      {props.children}
    </Router>
  )
}
