import { PagePath } from '@common/entitys/page.entity'
import BasicLayout from './layouts/BaseLayout'
import { BrowerRouter, Route } from './libs/router'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useEffect, useLayoutEffect } from 'react'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { LangHelper } from '@common/lang'
import NotFound from '@renderer/pages/errpages/404'
import Home from '@renderer/pages/Vault/Home'
import Register from '@renderer/pages/auth/Register'
import Vault from './pages/Vault/Vault'
import AdminLayout from './layouts/AdminLayout'
import AdminSet from './pages/admin/AdminSet'
import AdminLog from './pages/admin/AdminLog'
import Login from './pages/auth/Login'
import { ConsoleLog } from './libs/Console'

const RootRouter = () => {
  const appset = use_appset() as AppsetStore
  ConsoleLog.LogInfo('RootRouter render')
  useEffect(() => {
    initapp()
  }, [])
  const initapp = async () => {
    const lang = (await window.electron.ipcRenderer.invoke(webToManMsg.GetLang)) as string
    LangHelper.setLang(lang)
    appset.setLang(LangHelper.lang)
    appset.SetInitOK(true)
  }
  return (
    <BrowerRouter debug={false}>
      {/* <AppContext.Provider value={{ Lang: appset.lang }}> */}
      <Route>
        <Route path={PagePath.register} element={Register} match={{ end: true }} />
        <Route path={PagePath.Login} element={Login} match={{ end: true }} />
        <Route path={PagePath.Lock} element={Login} match={{ end: true }} />
        <Route path="/" element={BasicLayout} errorElement={NotFound}>
          <Route path="/" redirect={PagePath.Home} match={{ end: true }} />
          <Route path={PagePath.Home} element={Home} />
          <Route path={PagePath.Adminbase} element={AdminLayout} errorElement={NotFound}>
            {/*  prettier-ignore */}
            <Route
              path={PagePath.Adminbase}
              redirect={PagePath.Admin_valutitem}
              match={{ end: true }}
            />
            <Route path={PagePath.Admin_set} element={AdminSet} />
            <Route path={PagePath.Admin_valutitem_full} element={Vault} />
            <Route path={PagePath.Admin_log} element={AdminLog} />
          </Route>
        </Route>
      </Route>
      {/* </AppContext.Provider> */}
    </BrowerRouter>
  )
}
export default RootRouter
