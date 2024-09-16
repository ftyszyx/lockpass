import { PagePath } from '@common/entitys/page.entity'
import { HashRouter, Route } from './libs/router'
import { MainToWebMsg, webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useEffect } from 'react'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import NotFound from '@renderer/pages/errpages/404'
import Home from '@renderer/pages/Vault/Home'
import Vault from './pages/Vault/Vault'
import AdminLayout from './layouts/AdminLayout'
import AdminSet from './pages/admin/AdminSet'
import AdminLog from './pages/admin/AdminLog'
import Login from './pages/auth/Login'
import { ConsoleLog } from './libs/Console'
import { GetCurViewType, renderViewType } from '@common/entitys/app.entity'
import QucickLayout from './pages/quick/QuickLayout'
import QuickSearch from './pages/quick/QuickSearch'
import BaseLayout from './layouts/BaseLayout'
import AdminAbout from './pages/admin/AdminAbout'

const RootRouter = () => {
  const appset = use_appset() as AppsetStore
  useEffect(() => {
    initapp()
    window.electron.ipcRenderer.on(MainToWebMsg.LangChange, (_, lange) => {
      console.log('change lang', lange)
      appset.ChangeLang(lange)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners(MainToWebMsg.LangChange)
    }
  }, [])
  const viewtype = GetCurViewType()
  const initapp = async () => {
    console.log('initapp')
    const lang = (await window.electron.ipcRenderer.invoke(webToManMsg.GetLang)) as string
    appset.ChangeLang(lang)
    appset.SetInitOK(true)
    const version = (await window.electron.ipcRenderer.invoke(webToManMsg.getAppVersion)) as string
    appset.SetVersion(version)
  }
  ConsoleLog.info('RootRouter render', viewtype)
  return (
    <HashRouter debug={false}>
      {viewtype == renderViewType.Mainview && (
        <Route>
          <Route path={PagePath.register} element={Login} match={{ end: true }} />
          <Route path={PagePath.Login} element={Login} match={{ end: true }} />
          <Route path={PagePath.Lock} element={Login} match={{ end: true }} />
          <Route path="/" element={BaseLayout} errorElement={NotFound}>
            <Route path="/" redirect={PagePath.Home} match={{ end: true }} />
            <Route path={PagePath.Home} element={Home} />
            <Route path={PagePath.Adminbase} element={AdminLayout} errorElement={NotFound}>
              {/*  prettier-ignore */}
              <Route
                path={PagePath.Adminbase}
                redirect={PagePath.vault}
                match={{ end: true }}
              />
              <Route path={PagePath.Admin_set} element={AdminSet} />
              <Route path={PagePath.Vault_full} element={Vault} />
              <Route path={PagePath.Admin_log} element={AdminLog} />
              <Route path={PagePath.Admin_about} element={AdminAbout} />
            </Route>
          </Route>
        </Route>
      )}
      {viewtype == renderViewType.Quickview && (
        <Route>
          <Route path="/" element={QucickLayout} errorElement={NotFound}>
            <Route path="/" redirect={PagePath.Home} match={{ end: true }} />
            <Route path={PagePath.Home} element={QuickSearch} />
          </Route>
        </Route>
      )}
    </HashRouter>
  )
}
export default RootRouter
