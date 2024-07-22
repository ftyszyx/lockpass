import { ChildProps } from '@renderer/entitys/other.entity'
import { useEffect } from 'react'
import { message } from 'antd'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useHistory } from '@renderer/libs/router'
import { PagePath } from '@common/entitys/page.entity'
import { AppStore, use_appstore } from '@renderer/models/app.model'

function BaseLayout(props: ChildProps): JSX.Element {
  const history = useHistory()
  const appstore = use_appstore() as AppStore
  const [messageapi, contextHolder] = message.useMessage()
  useEffect(() => {
    window.electron.ipcRenderer.invoke(webToManMsg.needInitKey).then((res) => {
      if (res === true) {
        history.replace(PagePath.initKey)
      } else {
        getallData()
      }
    })
  }, [])
  async function getallData() {
    const users = await appstore.FetchAllUsers()
    if (users?.length > 0) {
      await appstore.SelectUser(users[0])
    } else {
      messageapi.error('请先添加用户')
      history.replace(PagePath.initKey)
    }
  }
  return (
    <div>
      {contextHolder}
      {props.children}
    </div>
  )
}

export default BaseLayout
