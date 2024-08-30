import { message } from 'antd'
import RootRouter from './route'
import { MainToWebMsg, webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useEffect } from 'react'
import { ConsoleLog } from './libs/Console'
function App(): JSX.Element {
  const [messageApi, contextHolder] = message.useMessage()
  useEffect(() => {
    window.electron.ipcRenderer.on(MainToWebMsg.ShowMsg, (_, type, msg, duration) => {
      if (type == 'error') messageApi.error(msg, duration)
      else if (type == 'info') messageApi.info(msg, duration)
    })
    window.electron.ipcRenderer.on(MainToWebMsg.ShowMsgMain, (_, type, msg, duration) => {
      if (type == 'error') messageApi.error(msg, duration)
      else if (type == 'info') messageApi.info(msg, duration)
    })
    window.electron.ipcRenderer.invoke(webToManMsg.getLogLevel).then((level) => {
      console.log('getLogLevel', level)
      ConsoleLog.log_level = level
    })

    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowMsg)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowMsgMain)
    }
  }, [])

  ConsoleLog.LogInfo('develop', import.meta.env.DEV)
  return (
    <div>
      {contextHolder}
      <RootRouter></RootRouter>
    </div>
  )
}

export default App
