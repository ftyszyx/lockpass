import { LinkProps, RouterStoreData } from './index'
import routerContext from './RouterContext'
export default function Link(props: LinkProps) {
  const { to } = props
  // console.log("link to render ", to);
  const cosumerFun = (value: RouterStoreData) => {
    return (
      <a
        href={to}
        onClick={(e) => {
          e.preventDefault()
          value.history?.push(to)
        }}
        className={props.className || ''}
      >
        {props.children}
      </a>
    )
  }
  return <routerContext.Consumer>{cosumerFun}</routerContext.Consumer>
}
