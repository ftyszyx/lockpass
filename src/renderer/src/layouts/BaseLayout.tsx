import { ChildProps } from '@renderer/entitys/other.entity'
import { useHistory } from '@renderer/libs/router'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { useEffect } from 'react'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { PagePath } from '@common/entitys/page.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { LastUserInfo } from '@common/entitys/user.entity'

function BaseLayout(props: ChildProps): JSX.Element {
  const history = useHistory()
  const appstore = use_appstore() as AppStore
  useEffect(() => {
    initApp()
  }, [])

  async function initApp() {
    ConsoleLog.LogInfo('initapp')
    const res = await window.electron.ipcRenderer.invoke(webToManMsg.HasLogin)
    if (res === true) {
      const userinfo = (await window.electron.ipcRenderer.invoke(
        webToManMsg.GetLastUserInfo
      )) as LastUserInfo
      await appstore.Login(userinfo.user)
      if (userinfo.has_init_key) {
        return
      } else {
        history.replace(PagePath.register)
        return
      }
    } else history.replace(PagePath.Login)
  }

  return <div>{props.children}</div>
}

export default BaseLayout
