import { useEffect, useState } from 'react'
import Router from './Router'
import { createBrowserHistory } from './history'
import { BrowerRouterProps } from './index'
export default function BrowerRouter(props: BrowerRouterProps) {
  const [history, setHistory] = useState(null)
  useEffect(() => {
    if (props.debug) console.log('create history')
    setHistory(createBrowserHistory({ debug: props.debug }))
  }, [])
  return (
    history && (
      <Router history={history} debug={props.debug || false} relative_path={props.relative_path}>
        {props.children}
      </Router>
    )
  )
}
