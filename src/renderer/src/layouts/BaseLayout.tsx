import { ChildProps } from '@renderer/entitys/other.entity'
import { useEffect } from 'react'
import { message } from 'antd'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useHistory } from '@renderer/libs/router'
import { PagePath } from '@common/entitys/page.entity'
import { AppStore, use_appstore } from '@renderer/models/app.model'

function BaseLayout(props: ChildProps): JSX.Element {
  console.log('basiclayout render')
  const history = useHistory()
  const appstore = use_appstore() as AppStore
  const [messageapi, contextHolder] = message.useMessage()
  useEffect(() => {
    window.electron.ipcRenderer.invoke(webToManMsg.needInitKey).then((res) => {
      console.log('get res', res)
      if (res === true) {
        history.replace(PagePath.initKey)
      } else {
        getallData()
      }
    })
  }, [])
  async function getallData() {
    await appstore.FetchAllUsers()
    var users = appstore.user_list
    if (users?.length > 0) {
      await appstore.SelectUser(users[0])
    } else {
      messageapi.error('请先添加用户')
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
