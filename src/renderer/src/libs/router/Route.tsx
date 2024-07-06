import { matchChild, childMatchRes, RouteProps, RouterStoreData, url_join } from './index'
import routerContext from './RouterContext'
import { PathMatch } from './match'
const Route = (props: RouteProps) => {
  const consume_func = (value: RouterStoreData) => {
    const pathname = value.history.PathName
    let route_path = props.path || ''
    if (value.match != null) {
      route_path = url_join(value.match.url, props.path || '')
    }
    let newcontext = value
    if (props.path != null) {
      const match = PathMatch(route_path, pathname, props?.match, value.debug)
      if (match == null) return null
      newcontext = { ...value, match } as RouterStoreData
    }
    const childmatch = matchChild(route_path, props.children, value)
    const render_res = render(props, childmatch, newcontext)
    if (render_res != null)
      return <routerContext.Provider value={newcontext}>{render_res}</routerContext.Provider>
    return null
  }
  return <routerContext.Consumer>{consume_func}</routerContext.Consumer>
}
Route.displayName = 'Route'
function render(parnet_props: RouteProps, child_match: childMatchRes, ctxvalue: RouterStoreData) {
  if (parnet_props.element != null) {
    if (typeof parnet_props.element == 'function') {
      if (child_match.child == null) {
        if (parnet_props.errorElement != null)
          return (
            <parnet_props.element>
              <parnet_props.errorElement />
            </parnet_props.element>
          )
        return <parnet_props.element />
      }
      return <parnet_props.element>{child_match.child}</parnet_props.element>
    }
    if (typeof parnet_props.element == 'object') {
      return parnet_props.element
    }
  }
  if (parnet_props.redirect != null) {
    setTimeout(() => {
      console.log('redirect to:', parnet_props.redirect)
      ctxvalue.history?.push(parnet_props.redirect as string)
    }, 0)
    return null
  }
  return child_match.child
}
export default Route
