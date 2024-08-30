import { useEffect, useState } from 'react'
import { HashRouteProps } from '.'
import { createHashHistory } from './history'
import Router from './Router'

export default function HashRouter(props: HashRouteProps) {
  const [history, setHistory] = useState(null)
  useEffect(() => {
    if (props.debug) console.log('create history')
    setHistory(createHashHistory({ debug: props.debug }))
  }, [])
  return (
    history && (
      <Router history={history} debug={props.debug || false} relative_path={props.relative_path}>
        {props.children}
      </Router>
    )
  )
}
