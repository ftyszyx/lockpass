import { message } from 'antd'
import RootRouter from './route'
function App(): JSX.Element {
  window.electron.ipcRenderer.on('ShowMsgErr', (_, msg, duration) => {
    message.error(msg, duration)
  })
  window.electron.ipcRenderer.on('ShowMsgInfo', (_, msg, duration) => {
    message.info(msg, duration)
  })
  return <RootRouter></RootRouter>
}

export default App
