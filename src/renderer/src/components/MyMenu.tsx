import { useState, useMemo, useEffect } from 'react'
import { Menu as MenuAntd } from 'antd'
import { ItemType, MenuItemType } from 'antd/es/menu/interface'
import Icon from '@renderer/components/icon'
import { cloneDeep } from 'lodash'
import { pathToRegexp, compile, Key } from 'path-to-regexp'
import { MyMenuType, MenuParamNull, getAllMenus, MenuValutID } from '@renderer/entitys/menu.entity'
import { Link, useHistory } from '@renderer/libs/router'
import { GetCommonTree } from '@renderer/libs/tools/tree'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { PagePath } from '@common/entitys/page.entity'
import { SYS_TEM_NAME } from '@common/gloabl'
type MenuNodeType = MyMenuType & MenuItemType
interface MenuProps {
  className?: string
}

export default function MyMenu(props: MenuProps): JSX.Element {
  const location = useHistory()
  const appstore = use_appstore() as AppStore
  const [chosedKey, setChosedKey] = useState<string[]>([]) // 当前选中
  const [openKeys, setOpenKeys] = useState<string[]>([]) // 当前需要被展开的项

  const menutree_info = useMemo(() => {
    console.log('get all menus')
    let menulist = cloneDeep(getAllMenus())
    appstore.vaults.forEach((item) => {
      menulist.push({
        id: item.id,
        sorts: 1000 + item.id,
        title: item.name,
        icon_style_type: item.icon,
        url: `${PagePath.Admin_valutitem}/${item.id}`,
        parent: MenuValutID + ''
      })
    })
    menulist.sort((a, b) => {
      return a.sorts - b.sorts
    })
    return GetCommonTree<MenuNodeType>(menulist as MenuNodeType[])
  }, [appstore.vaults])
  /** 处理原始数据，将原始数据处理为层级关系 **/
  const treeDom: ItemType[] = useMemo(() => {
    menutree_info.datalist.forEach((item) => {
      item.icon = <Icon type={item.icon_style_type}></Icon>
      item.label = item.title
    })
    return menutree_info.trees
  }, [menutree_info])

  // 当页面路由跳转时，即location发生改变，则更新选中项
  useEffect(() => {
    for (let i = 0; i < menutree_info.datalist.length; i++) {
      const menuinfo = menutree_info.datalist[i]
      const regs = pathToRegexp(menuinfo.url, [], { end: true, start: true })
      if (regs.test(location.PathName)) {
        setChosedKey([menuinfo.id.toString()])
        let new_opens = [menuinfo.id.toString()]
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
    <div className={`${props.className} bg-slate-800 ${appstore.fold_menu ? 'hidden' : 'w-60'}`}>
      <div>
        <Link
          to={PagePath.Home}
          className={appstore.fold_menu ? ' hidden' : ' flex h-full items-center'}
        >
          <div className=" text-white w-full m-4 text-lg">{SYS_TEM_NAME}</div>
        </Link>
      </div>
      <MenuAntd
        theme="dark"
        mode="inline"
        items={treeDom}
        selectedKeys={chosedKey}
        {...(appstore.fold_menu ? {} : { openKeys })}
        onOpenChange={(keys: string[]) => setOpenKeys(keys)}
        onSelect={(e) => {
          const menuinfo = menutree_info.datamap.get(e.key)
          if (menuinfo) {
            const params_keys: Key[] = []
            pathToRegexp(menuinfo.url, params_keys)
            console.log('slect parmskeys', params_keys)
            location.push(menuinfo.url)
            setChosedKey([menuinfo.key])
          }
        }}
      />
    </div>
  )
}
