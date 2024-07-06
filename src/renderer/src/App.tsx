import { message } from 'antd'
import RootRouter from './route'
import { MainToWebMsg } from '@common/entitys/ipcmsg.entity'
import { useEffect } from 'react'
function App(): JSX.Element {
  useEffect(() => {
    window.electron.ipcRenderer.on(MainToWebMsg.ShowErrorMsg, (_, msg, duration) => {
      message.error(msg, duration)
    })
    window.electron.ipcRenderer.on(MainToWebMsg.ShowInfoMsg, (_, msg, duration) => {
      message.info(msg, duration)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowErrorMsg)
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.ShowInfoMsg)
    }
  }, [])

  return <RootRouter></RootRouter>
}

export default App
