import { PagePath } from '@common/entitys/page.entity'
import BasicLayout from './layouts/BasicLayout'
import { BrowerRouter, Route } from './libs/router'
import NotFound from '@renderer/pages/errpages/404'
import Home from '@renderer/pages/system/Home'
import InitSystem from './pages/init/InitSystem'

const RootRouter = () => {
  return (
    <BrowerRouter>
      <Route>
        <Route path={PagePath.initKey} element={InitSystem} />
        <Route path="/" element={BasicLayout} errorElement={NotFound}>
          <Route path="/" redirect={PagePath.AdminHome} match={{ end: true }} />
          <Route path={PagePath.AdminHome} element={Home} />
        </Route>
      </Route>
    </BrowerRouter>
  )
}
export default RootRouter
