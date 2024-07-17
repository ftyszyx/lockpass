import { PagePath } from '@common/entitys/page.entity'
import BasicLayout from './layouts/BaseLayout'
import { BrowerRouter, HashRouter, Route } from './libs/router'
import NotFound from '@renderer/pages/errpages/404'
import Home from '@renderer/pages/system/Home'
import InitSystem from './pages/init/InitSystem'
import Vault from './pages/system/Vault'

const RootRouter = () => {
  return (
    <BrowerRouter debug={false}>
      <Route>
        <Route path={PagePath.initKey} element={InitSystem} match={{ end: true }} />
        <Route path={PagePath.AdminHome} element={Home} />
        <Route path="/" element={BasicLayout} errorElement={NotFound}>
          <Route path="/" redirect={PagePath.AdminHome} match={{ end: true }} />
          <Route path={PagePath.Valut_items + '/:id'} element={Vault} />
        </Route>
      </Route>
    </BrowerRouter>
  )
}
export default RootRouter
