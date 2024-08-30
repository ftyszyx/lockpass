import { PagePath } from '@common/entitys/page.entity'
import { BrowerRouter, Route } from './libs/router'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useEffect } from 'react'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { LangHelper } from '@common/lang'
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
  }, [])
  const initapp = async () => {
    console.log('initapp')
    const lang = (await window.electron.ipcRenderer.invoke(webToManMsg.GetLang)) as string
    LangHelper.setLang(lang)
    appset.setLang(LangHelper.lang)
    appset.SetInitOK(true)
  }
  const viewtype = GetCurViewType()
  ConsoleLog.LogInfo('RootRouter render', viewtype)
  return (
    <BrowerRouter debug={true}>
      {viewtype == renderViewType.Mainview ? (
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
      ) : (
        <Route>
          <Route path="/" element={QucickLayout} errorElement={NotFound}>
            <Route path="/" redirect={PagePath.Home} match={{ end: true }} />
            <Route path="/quick.html" redirect={PagePath.Home} match={{ end: true }} />
            <Route path={PagePath.Home} element={QuickSearch} />
          </Route>
        </Route>
      )}
    </BrowerRouter>
  )
}
export default RootRouter
