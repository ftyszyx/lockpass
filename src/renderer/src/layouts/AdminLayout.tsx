import { ChildProps } from '@renderer/entitys/other.entity'
import MyMenu from '@renderer/components/MyMenu'
import { useEffect, useState } from 'react'
import AddPasswordPanel from '@renderer/pages/Vault/AddPasswordPanel'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { shortKeys } from '@renderer/libs/tools/shortKeys'
import { AppStore, use_appstore } from '@renderer/models/app.model'

function AdminLayout(props: ChildProps): JSX.Element {
  const [show_add_vault, set_show_add_vault] = useState(false)
  const appstore = use_appstore() as AppStore
  const getText = use_appset((state) => state.getText) as AppsetStore['getText']
  useEffect(() => {
    const quickadd_Func = () => {
      set_show_add_vault(true)
      return true
    }
    const quickaddkey = appstore.GetUserSet().shortcut_local_add
    if (quickaddkey) {
      shortKeys.unbindCallback(quickadd_Func)
      shortKeys.bindShortKey(quickaddkey, quickadd_Func)
    }
    return () => {
      shortKeys.unbindCallback(quickadd_Func)
    }
  }, [appstore.GetUserSet().shortcut_local_add])
  return (
    <div className="flex flex-row h-screen">
      <MyMenu />
      {/* right side */}
      <div className=" flex-grow ">
        <div className=" min-h-[280px] h-full">{props.children}</div>
      </div>
      {show_add_vault && (
        <AddPasswordPanel
          show={show_add_vault}
          title={getText('vaultitem.label.add_vault_item')}
          onOk={async () => {
            set_show_add_vault(false)
          }}
          onClose={() => {
            set_show_add_vault(false)
          }}
        ></AddPasswordPanel>
      )}
    </div>
  )
}

export default AdminLayout
