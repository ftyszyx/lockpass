import { Dropdown, Layout } from 'antd'
import { MenuFoldOutlined, ReloadOutlined } from '@ant-design/icons'
import { AppStore, use_appstore } from '@renderer/models/app.model'
const { Header } = Layout

export default function MyHeader(): JSX.Element {
  const appstore = use_appstore() as AppStore
  const toggle_style = 'py-1 px-1 text-2xl cursor-pointer transition-all'
  return (
    <div>
      <Header className="bg-white p-0 shadow overflow-hidden flex items-center">
        {/* <MenuFoldOutlined
          className={appstore.fold_menu ? toggle_style : toggle_style + ' rotate-180'}
          onClick={() => appstore.toggleFoldMenu()}
        /> */}
        <div className="flex justify-end items-center flex-auto"></div>
      </Header>
    </div>
  )
}
