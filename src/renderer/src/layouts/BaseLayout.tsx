import { ChildProps } from '@renderer/entitys/other.entity'
import { useHistory } from '@renderer/libs/router'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { useEffect } from 'react'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { PagePath } from '@common/entitys/page.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { LastUserInfo } from '@common/entitys/user.entity'
import { message } from 'antd'
import { ipc_call } from '@renderer/libs/tools/other'
import { useLang } from '@renderer/libs/AppContext'

function BaseLayout(props: ChildProps): JSX.Element {
  const [messageApi] = message.useMessage()
  const history = useHistory()
  const lang = useLang()
  const appstore = use_appstore() as AppStore
  ConsoleLog.LogInfo('baselayout render')
  useEffect(() => {
    initApp()
  }, [])

  async function initApp() {
    const userinfo = await ipc_call<LastUserInfo>(webToManMsg.GetLastUserInfo).catch((error) => {
      messageApi.error(lang.getLangText(`err.${error.code}`))
    })
    if (userinfo) {
      appstore.SetUser(userinfo.user)
      if (userinfo.has_init_key) {
        const havelogin = await ipc_call<boolean>(webToManMsg.HasLogin).catch((error) => {
          messageApi.error(lang.getLangText(`err.${error.code}`))
        })
        if (havelogin == false) {
          history.replace(PagePath.Login)
        }
      } else {
        history.replace(PagePath.register)
        return
      }
    }
  }

  return <div>{props.children}</div>
}

export default BaseLayout
