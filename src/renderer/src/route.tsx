import { PagePath } from '@common/entitys/page.entity'
import BasicLayout from './layouts/BaseLayout'
import { BrowerRouter, Route, useHistory } from './libs/router'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useEffect, useLayoutEffect } from 'react'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { LangHelper } from '@common/lang'
import { AppContext } from '@renderer/libs/AppContext'
import NotFound from '@renderer/pages/errpages/404'
import Home from '@renderer/pages/system/Home'
import Register from '@renderer/pages/auth/Register'
import Vault from './pages/system/Vault'
import AdminLayout from './layouts/AdminLayout'
import AdminSet from './pages/system/AdminSet'
import AdminLog from './pages/system/AdminLog'
import Login from './pages/auth/Login'

const RootRouter = () => {
  const appset = use_appset() as AppsetStore
  useEffect(() => {
    initapp()
  }, [])
  const initapp = async () => {
    const lang = (await window.electron.ipcRenderer.invoke(webToManMsg.GetLang)) as string
    LangHelper.setLang(lang)
    appset.setLang(LangHelper.lang)
  }
  return (
    <BrowerRouter debug={true}>
      <AppContext.Provider value={{ Lang: appset.lang }}>
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
      </AppContext.Provider>
    </BrowerRouter>
  )
}
export default RootRouter
