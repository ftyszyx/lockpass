import { useState, useMemo, useEffect, useRef } from 'react'
import { Menu as MenuAntd, MenuRef } from 'antd'
import { ItemType, MenuItemType } from 'antd/es/menu/interface'
import Icon from '@renderer/components/Icon'
import { pathToRegexp } from 'path-to-regexp'
import {
  MyMenuType,
  getAllMenus,
  MenuValutID,
  ValutAddEvent,
  MenuVaultBaseId,
  MenuParamNull
} from '@renderer/entitys/menu.entity'
import { Link, useHistory } from '@renderer/libs/router'
import { GetCommonTree } from '@renderer/libs/tools/tree'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { PagePath } from '@common/entitys/page.entity'
import { Icon_type, ModalType } from '@common/gloabl'
import AddValutPanel from '@renderer/pages/Vault/AddVaultPanel'
import { ConsoleLog } from '@renderer/libs/Console'
import { use_appset } from '@renderer/models/appset.model'
import MyDropDown from './MyDropDown'
import { shortKeys } from '@renderer/libs/tools/shortKeys'
import { KEY_MAP } from '@common/keycode'
import { ViewFocusType } from '@renderer/entitys/other.entity'

interface MenuProps {
  className?: string
}

export default function MyMenu(props: MenuProps): JSX.Element {
  const location = useHistory()
  const appstore = use_appstore() as AppStore
  const lang = use_appset((state) => state.lang)
  const fold_menu = use_appset((state) => state.fold_menu)
  const getText = use_appset((state) => state.getText)
  const getViewFoucs = use_appset((state) => state.GetViewFoucs)
  const setViewFoucs = use_appset((state) => state.SetViewFoucs)
  const [chosedKey, setChosedKey] = useState<string[]>([]) // 当前选中
  const [openKeys, setOpenKeys] = useState<string[]>([]) // 当前需要被展开的项
  const [show_addvalut, setShowAddValut] = useState(false)
  const menu_ref = useRef<MenuRef>(null)
  useEffect(() => {
    const keycomba = KEY_MAP.ctrl + '+1'
    shortKeys.bindShortKey(keycomba, () => {
      handleFocus()
      return false
    })
    return () => {
      shortKeys.unbindShortKey(keycomba)
    }
  }, [menu_ref.current])

  useEffect(() => {
    const view_focus = getViewFoucs()
    const active_ele = document.activeElement
    // console.log('view_focus change', view_focus, active_ele)
    if (view_focus !== ViewFocusType.Menu) {
      if (active_ele) {
        const ele = active_ele as HTMLElement
        ele.blur()
      }
    }
  }, [getViewFoucs()])

  const handleFocus = () => {
    if (menu_ref.current) {
      setViewFoucs(ViewFocusType.Menu)
      menu_ref.current.focus()
    }
  }

  const menutree_info = useMemo(() => {
    const menulist = getAllMenus({
      lang,
      CallEvent: async (event: string) => {
        if (event === ValutAddEvent) {
          setShowAddValut(true)
        }
      }
    })
    appstore.vaults.forEach((item) => {
      const id = MenuVaultBaseId + item.id
      menulist.push({
        id,
        key: id.toString(),
        sorts: 1000 + item.id,
        title: item.name,
        icon_style_type: item.icon,
        url: `${PagePath.vault}/${item.id}/${MenuParamNull}`,
        parent: MenuValutID + ''
      })
    })
    menulist.sort((a, b) => {
      return a.sorts - b.sorts
    })
    const res = GetCommonTree<MyMenuType>(menulist)
    return res
  }, [appstore.vaults, lang])
  ConsoleLog.info('render mymenu')
  /** 处理原始数据，将原始数据处理为层级关系 **/
  const treeDom = useMemo(() => {
    menutree_info.datalist.forEach((item) => {
      item.icon = <Icon type={item.icon_style_type}></Icon>
      item.label = item.title
    })
    return menutree_info.trees as ItemType<MenuItemType>[]
  }, [menutree_info])

  useEffect(() => {
    // console.log('change menu foucs')
    handleFocus()
  }, [treeDom, openKeys])

  // 当页面路由跳转时，即location发生改变，则更新选中项
  useEffect(() => {
    for (let i = 0; i < menutree_info.datalist.length; i++) {
      const menuinfo = menutree_info.datalist[i]
      const regs = pathToRegexp(menuinfo.url, [], { end: true, start: true })
      if (regs.test(location.PathName)) {
        setChosedKey([menuinfo.id.toString()])
        const new_opens = [menuinfo.id.toString()]
        let cur_menu = menuinfo
        while (cur_menu.parent && cur_menu.parent != '0') {
          const parent_id = cur_menu.parent
          new_opens.push(parent_id)
          const tmp = menutree_info.datamap.get(parent_id)
          if (tmp == null) break
          cur_menu = tmp
        }
        setOpenKeys(new_opens)
        break
      }
    }
  }, [location.PathName, menutree_info])

  return (
    <>
      <div className={`${props.className} bg-slate-800 ${fold_menu ? 'hidden' : 'w-60'} relative`}>
        <div className="flex flex-row justify-between p-1 items-center">
          <div className="flex flex-row items-center text-white">
            <Link to={PagePath.Home}>
              <Icon type={Icon_type.icon_home} className=" mr-2  text-[25px]  " />
            </Link>
            {appstore.GetCurUser()?.username}
          </div>
          <MyDropDown className=" text-white" />
        </div>
        <MenuAntd
          theme="dark"
          mode="inline"
          className=" overflow-y-auto max-h-[var(--content-height)] scroll_enabled"
          ref={menu_ref}
          items={treeDom}
          selectedKeys={chosedKey}
          {...(fold_menu ? {} : { openKeys })}
          onOpenChange={(keys: string[]) => setOpenKeys(keys)}
          onSelect={(e) => {
            const menuinfo = menutree_info.datamap.get(e.key)
            if (menuinfo) {
              if (menuinfo.url || '' !== '') location.push(menuinfo.url)
              setChosedKey([menuinfo.key])
            }
          }}
        />
        <div className="  text-white kbd bottom-0 absolute left-[50%] translate-x-[-50%]">
          Ctrl+1
        </div>
      </div>
      {show_addvalut && (
        <AddValutPanel
          show={show_addvalut}
          title={getText('vault.add.title')}
          show_type={ModalType.Add}
          show_del={false}
          onAddOk={async () => {
            setShowAddValut(false)
          }}
          onClose={() => {
            setShowAddValut(false)
          }}
        />
      )}
    </>
  )
}
