import { useLayoutEffect, useState } from 'react'
import { RouterProps, RouterStoreData } from './index'
import routerContext from './RouterContext'
export default function Router(props: RouterProps) {
  if (props.debug) console.log('router render', props.history?.PathName)
  const [locationState, setLocationState] = useState(props.history?.CurLocation)
  useLayoutEffect(() => {
    const removeListen = props.history?.listen(({ location, action }) => {
      if (props.debug) console.log('location change', location, action)
      setLocationState(location)
    })
    return removeListen
  }, [])
  const context = {
    location: locationState,
    history: props.history,
    debug: props.debug,
    relative_path: props.relative_path
  } as RouterStoreData
  return <routerContext.Provider value={context}>{props.children}</routerContext.Provider>
}
