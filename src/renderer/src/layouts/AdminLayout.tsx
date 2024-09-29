import { ChildProps } from '@renderer/entitys/other.entity'
import MyMenu from '@renderer/components/MyMenu'
import { useEffect } from 'react'
import { shortKeys } from '@renderer/libs/tools/shortKeys'
import { use_appstore } from '@renderer/models/app.model'
import { useHistory } from '@renderer/libs/router'
import { PagePath } from '@common/entitys/page.entity'
import { MenuParamNull } from '@renderer/entitys/menu.entity'
import { useShallow } from 'zustand/react/shallow'
// import { Button } from 'antd'
// import { ipc_call_normal } from '@renderer/libs/tools/other'
// import { webToManMsg } from '@common/entitys/ipcmsg.entity'

function AdminLayout(props: ChildProps): JSX.Element {
  const [getUserSet, getVaults, setQuickInput] = use_appstore(
    useShallow((state) => [state.GetUserSet, state.getVaults, state.setQuickInput])
  )
  const history = useHistory()
  useEffect(() => {
    const quickfind_Func = () => {
      if (history.PathName.startsWith(PagePath.vault) == false) {
        const vaults = getVaults()
        let newurl = ''
        if (vaults.length > 0) {
          newurl = `${PagePath.vault}/${vaults[0].id}/${MenuParamNull}`
        } else {
          newurl = `${PagePath.Home}`
        }
        history.push(newurl)
      }
      setQuickInput({ quick_search: true })
      return true
    }
    const quickfindkey = getUserSet().shortcut_local_find
    if (quickfindkey) {
      shortKeys.unbindCallback(quickfind_Func)
      shortKeys.bindShortKey(quickfindkey, quickfind_Func)
    }
    return () => {
      shortKeys.unbindCallback(quickfind_Func)
    }
  }, [getUserSet().shortcut_local_find])

  useEffect(() => {
    const quickadd_Func = () => {
      if (history.PathName.startsWith(PagePath.vault) == false) {
        const vaults = getVaults()
        let newurl = ''
        if (vaults.length > 0) {
          newurl = `${PagePath.vault}/${vaults[0].id}/${MenuParamNull}`
        } else {
          newurl = `${PagePath.Home}`
        }
        history.push(newurl)
      }
      setQuickInput({ quick_add: true })
      return true
    }
    const quickaddkey = getUserSet().shortcut_local_add
    if (quickaddkey) {
      shortKeys.unbindCallback(quickadd_Func)
      shortKeys.bindShortKey(quickaddkey, quickadd_Func)
    }
    return () => {
      shortKeys.unbindCallback(quickadd_Func)
    }
  }, [getUserSet().shortcut_local_add])

  return (
    <div className="flex flex-row h-screen">
      <MyMenu />
      {/* <Button
        onClick={async () => {
          await ipc_call_normal(webToManMsg.LoginGoogledrive)
        }}
      >
        goole login
      </Button> */}
      {/* right side */}
      <div className=" flex-grow ">
        <div className=" min-h-[280px] h-full">{props.children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
