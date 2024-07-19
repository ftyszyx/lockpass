import { PagePath } from '@common/entitys/page.entity'
import BasicLayout from './layouts/BaseLayout'
import { BrowerRouter, Route } from './libs/router'
import NotFound from '@renderer/pages/errpages/404'
import Home from '@renderer/pages/system/Home'
import InitSystem from './pages/init/InitSystem'
import Vault from './pages/system/Vault'
import AdminLayout from './layouts/AdminLayout'
import AdminSet from './pages/system/AdminSet'

const RootRouter = () => {
  return (
    <BrowerRouter debug={false}>
      <Route>
        <Route path={PagePath.initKey} element={InitSystem} match={{ end: true }} />
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
          </Route>
        </Route>
      </Route>
    </BrowerRouter>
  )
}
export default RootRouter
