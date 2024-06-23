import { matchChild, childMatchRes, RouteProps, RouterStoreData, url_join } from './index'
import routerContext from './RouterContext'
import { PathMatch } from './match'
const Route = (props: RouteProps) => {
  const consume_func = (value: RouterStoreData) => {
    const url = value.history.PathName
    let true_path = props.path || ''
    if (value.match != null) {
      true_path = url_join(value.match.url, props.path || '')
    }
    // if (value.debug) console.log("route path1 :", props, "path:", true_path, "url:", url);
    let newcontext = value
    if (props.path != null) {
      const match = PathMatch(true_path, url, props?.match, value.debug)
      if (match == null) return null
      newcontext = { ...value, match } as RouterStoreData
    }
    const childmatch = matchChild(true_path, props.children, value)
    // if (value.debug) console.log("route path2:", props, "path:", true_path, "url:", url, "context:", value, "child", childmatch);
    const child = renderChild(props, childmatch, newcontext)
    if (value.debug)
      console.log(
        'route path3',
        props.path,
        'child:',
        child,
        'have errElement:',
        props.errorElement != null
      )
    if (child != null)
      return <routerContext.Provider value={newcontext}>{child}</routerContext.Provider>
    return null
  }
  return <routerContext.Consumer>{consume_func}</routerContext.Consumer>
}
Route.displayName = 'Route'
function renderChild(props: RouteProps, child_match: childMatchRes, ctxvalue: RouterStoreData) {
  if (props.element != null) {
    if (typeof props.element == 'function') {
      // console.log("render func child", child_match.child);
      if (child_match.child == null) {
        if (props.errorElement != null)
          return (
            <props.element>
              <props.errorElement />
            </props.element>
          )
        return <props.element />
      }
      return <props.element>{child_match.child}</props.element>
    }
    if (typeof props.element == 'object') {
      return props.element
    }
  }
  if (props.redirect != null) {
    setTimeout(() => {
      ctxvalue.history?.push(props.redirect as string)
    }, 0)
    return null
  }
  return child_match.child
}
export default Route
