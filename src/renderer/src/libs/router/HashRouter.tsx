import { HashRouteProps } from '.'
import { createHashHistory } from './history'
import Router from './Router'

export default function HashRouter(props: HashRouteProps) {
  const history = createHashHistory({ debug: props.debug })
  return (
    <Router history={history} debug={props.debug || false} relative_path={props.relative_path}>
      {props.children}
    </Router>
  )
}
