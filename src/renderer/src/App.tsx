import { message } from 'antd'
import RootRouter from './route'
import { MainToWebMsg, webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useEffect } from 'react'
import { LangHelper } from '@common/lang'
function App(): JSX.Element {
  const [messageApi, contextHolder] = message.useMessage()
  useEffect(() => {
    window.electron.ipcRenderer.on(MainToWebMsg.ShowErrorMsg, (_, msg, duration) => {
      messageApi.error(msg, duration)
    })
    window.electron.ipcRenderer.on(MainToWebMsg.ShowInfoMsg, (_, msg, duration) => {
      messageApi.info(msg, duration)
    })
    initapp()
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowErrorMsg)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowInfoMsg)
    }
  }, [])

  console.log('develop', import.meta.env.DEV)

  const initapp = async () => {
    const lang = (await window.electron.ipcRenderer.invoke(webToManMsg.GetLang)) as string
    LangHelper.setLang(lang)
  }
  return (
    <div>
      {contextHolder}
      <RootRouter></RootRouter>
    </div>
  )
}

export default App
