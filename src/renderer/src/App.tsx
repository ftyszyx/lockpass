import { message } from 'antd'
import RootRouter from './route'
import { MainToWebMsg } from '@common/entitys/ipcmsg.entity'
import { useEffect } from 'react'
import { ConsoleLog } from './libs/Console'
function App(): JSX.Element {
  const [messageApi, contextHolder] = message.useMessage()
  useEffect(() => {
    window.electron.ipcRenderer.on(MainToWebMsg.ShowErrorMsg, (_, msg, duration) => {
      messageApi.error(msg, duration)
    })
    window.electron.ipcRenderer.on(MainToWebMsg.ShowInfoMsg, (_, msg, duration) => {
      messageApi.info(msg, duration)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowErrorMsg)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowInfoMsg)
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
