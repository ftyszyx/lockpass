import './assets/main.css'
import '@renderer/assets/iconfont/iconfont.css'
import './assets/tailwind_out.css'
import '@renderer/assets/iconfont/iconfont.js'

import ReactDOM from 'react-dom/client'
import App from './App'
import { InitCurViewType, renderViewType } from '@common/entitys/app.entity'
import { ConsoleLog } from './libs/Console'

const main_element = document.getElementById('root') as HTMLElement
const quick_element = document.getElementById('root_quick') as HTMLElement
const password_element = document.getElementById('password') as HTMLElement
if (main_element) {
  ConsoleLog.LogInfo('main_element')
  InitCurViewType(renderViewType.Mainview)
  ReactDOM.createRoot(main_element).render(<App />)
}
if (quick_element) {
  ConsoleLog.LogInfo('quick_element')
  InitCurViewType(renderViewType.Quickview)
  ReactDOM.createRoot(quick_element).render(<App />)
}
if (password_element) {
  ConsoleLog.LogInfo('password_element')
  InitCurViewType(renderViewType.Password)
  ReactDOM.createRoot(password_element).render(<App />)
}
