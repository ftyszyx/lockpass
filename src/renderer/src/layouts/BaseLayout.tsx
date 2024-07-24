import { ChildProps } from '@renderer/entitys/other.entity'
import { useEffect } from 'react'
import { message } from 'antd'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useHistory } from '@renderer/libs/router'
import { PagePath } from '@common/entitys/page.entity'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { LangHelper } from '@common/lang'
import { AppContext } from '@renderer/libs/AppContext'

function BaseLayout(props: ChildProps): JSX.Element {
  const history = useHistory()
  const appstore = use_appstore() as AppStore
  const [messageapi, contextHolder] = message.useMessage()
  const appset = use_appset() as AppsetStore
  useEffect(() => {
    window.electron.ipcRenderer.invoke(webToManMsg.needInitKey).then((res) => {
      if (res === true) {
        history.replace(PagePath.initKey)
      } else {
        getallData()
      }
    })
    initapp()
  }, [])
  const initapp = async () => {
    const lang = (await window.electron.ipcRenderer.invoke(webToManMsg.GetLang)) as string
    LangHelper.setLang(lang)
    appset.setLang(LangHelper.lang)
  }
  // console.log('appLang', appset.lang)
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
    <AppContext.Provider value={{ Lang: appset.lang }}>
      <div>
        {contextHolder}
        {props.children}
      </div>
    </AppContext.Provider>
  )
}

export default BaseLayout
