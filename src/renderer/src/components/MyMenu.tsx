import { useState, useMemo, useEffect } from 'react'
import { Layout, Menu as MenuAntd } from 'antd'
import { ItemType, MenuItemType } from 'antd/es/menu/interface'
const { Sider } = Layout
import ImgLogo from '@renderer/assets/logo.png'
import Icon from '@renderer/components/icon'
import { cloneDeep } from 'lodash'
import { pathToRegexp, compile, Key } from 'path-to-regexp'
import { MyMenuType, MenuParamNull, getAllMenus } from '@renderer/entitys/menu.entity'
import { Link, useHistory } from '@renderer/libs/router'
import { GetCommonTree } from '@renderer/libs/tools/tree'
import { AppStore, use_appstore } from '@renderer/models/app.model'
type MenuNodeType = MyMenuType & MenuItemType

export default function MyMenu(): JSX.Element {
  const location = useHistory()
  const appstore = use_appstore() as AppStore
  const [chosedKey, setChosedKey] = useState<string[]>([]) // 当前选中
  const [openKeys, setOpenKeys] = useState<string[]>([]) // 当前需要被展开的项

  const menutree_info = useMemo(() => {
    console.log('get all menus')
    const menulist = cloneDeep(getAllMenus())
    menulist.sort((a, b) => {
      return a.sorts - b.sorts
    })
    return GetCommonTree<MenuNodeType>(menulist)
  }, [])
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
    <Sider
      width={256}
      className=" min-h-full"
      trigger={null}
      collapsible
      collapsed={appstore.fold_menu}
    >
      <div className={'h-16 bg-slate-800'}>
        <Link to="/" className={appstore.fold_menu ? ' hidden' : ' flex h-full items-center'}>
          <img src={ImgLogo} className=" w-10 ml-3" />
          <div className=" text-white w-full" style={{ width: '100 %', fontSize: '24px' }}>
            value manager
          </div>
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
            // console.log("slect parmskeys", params_keys);
            if (params_keys.length == 0) {
              location.push(menuinfo.url)
            } else {
              const topath = compile(menuinfo.url)
              const newvalue: Record<string, any> = {}
              params_keys.forEach((item) => {
                newvalue[item.name] = MenuParamNull
              })
              const new_url = topath(newvalue)
              console.log(`menu path ${menuinfo.url}->${new_url}`)
              location.push(new_url)
            }
            setChosedKey([menuinfo.key])
          }
        }}
      />
    </Sider>
  )
}
