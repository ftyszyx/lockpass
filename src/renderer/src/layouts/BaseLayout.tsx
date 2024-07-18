import { ChildProps } from '@renderer/entitys/other.entity'
import { useEffect } from 'react'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useHistory } from '@renderer/libs/router'
import { PagePath } from '@common/entitys/page.entity'
import { AppStore, use_appstore } from '@renderer/models/app.model'

function BaseLayout(props: ChildProps): JSX.Element {
  console.log('basiclayout render')
  const history = useHistory()
  const appstore = use_appstore() as AppStore
  useEffect(() => {
    console.log('useEffect')
    window.electron.ipcRenderer.invoke(webToManMsg.needInitKey).then((res) => {
      console.log('get res', res)
      if (res === true) {
        history.replace(PagePath.initKey)
      } else {
        appstore.FetchAllUsers()
      }
    })
  }, [])
  return <div>{props.children}</div>
}

export default BaseLayout
