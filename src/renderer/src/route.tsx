import { PagePath } from '@renderer/entitys/page.entity'
import BasicLayout from './layouts/BasicLayout'
import { BrowerRouter, Route } from './libs/router'
import NotFound from '@renderer/pages/errpages/404'
import Home from '@renderer/pages/system/Home'

const RootRouter = () => {
  return (
    <BrowerRouter>
      <Route path="/" element={BasicLayout} errorElement={NotFound}>
        <Route path="/" redirect={PagePath.AdminHome} match={{ end: true }} />
        <Route path={PagePath.AdminHome} element={Home} />
      </Route>
    </BrowerRouter>
  )
}
export default RootRouter
