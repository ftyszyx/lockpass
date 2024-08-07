import { message } from 'antd'
import RootRouter from './route'
import { MainToWebMsg } from '@common/entitys/ipcmsg.entity'
import { useEffect } from 'react'
import { ConsoleLog } from './libs/Console'
function App(): JSX.Element {
  const [messageApi, contextHolder] = message.useMessage()
  useEffect(() => {
    window.electron.ipcRenderer.on(MainToWebMsg.ShowMsg, (_, type, msg, duration) => {
      if (type == 'error') messageApi.error(msg, duration)
      else if (type == 'info') messageApi.info(msg, duration)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowMsg)
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
