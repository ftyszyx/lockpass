import { useState, useMemo, useEffect } from 'react'
import { Dropdown, Menu as MenuAntd, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { ItemType, MenuItemType } from 'antd/es/menu/interface'
import Icon from '@renderer/components/icon'
import { cloneDeep } from 'lodash'
import { pathToRegexp, Key } from 'path-to-regexp'
import { MyMenuType, getAllMenus, MenuValutID, ValutAddEvent } from '@renderer/entitys/menu.entity'
import { Link, useHistory } from '@renderer/libs/router'
import { GetCommonTree } from '@renderer/libs/tools/tree'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { PagePath } from '@common/entitys/page.entity'
import { Icon_type, ModalType, SYS_TEM_NAME } from '@common/gloabl'
import AddValutPanel from '@renderer/pages/Vault/AddVaultPanel'
import { ConsoleLog } from '@renderer/libs/Console'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
interface MenuProps {
  className?: string
}

export default function MyMenu(props: MenuProps): JSX.Element {
  const location = useHistory()
  const appstore = use_appstore() as AppStore
  const appset = use_appset() as AppsetStore
  const [chosedKey, setChosedKey] = useState<string[]>([]) // 当前选中
  const [openKeys, setOpenKeys] = useState<string[]>([]) // 当前需要被展开的项
  const [show_addvalut, setShowAddValut] = useState(false)

  const menutree_info = useMemo(() => {
    let menulist = cloneDeep(
      getAllMenus({
        CallEvent: async (event: string) => {
          if (event === ValutAddEvent) {
            setShowAddValut(true)
          }
        }
      })
    )
    appstore.vaults.forEach((item) => {
      menulist.push({
        id: item.id,
        key: item.id + '',
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
    return GetCommonTree<MyMenuType>(menulist)
  }, [appstore.vaults])
  /** 处理原始数据，将原始数据处理为层级关系 **/
  const treeDom = useMemo(() => {
    menutree_info.datalist.forEach((item) => {
      item.icon = <Icon type={item.icon_style_type}></Icon>
      item.label = item.title
    })
    ConsoleLog.LogInfo('treeDom', menutree_info.trees)
    return menutree_info.trees as ItemType<MenuItemType>[]
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
    <>
      <div className={`${props.className} bg-slate-800 ${appset.fold_menu ? 'hidden' : 'w-60'}`}>
        <div>
          <Link
            to={PagePath.Home}
            className={appset.fold_menu ? ' hidden' : ' flex h-full items-center'}
          >
            <div className=" text-white w-full m-4 text-lg">{SYS_TEM_NAME}</div>
          </Link>
        </div>
        {/* user settings */}
        <Dropdown
          menu={{
            onClick: () => {},
            items: [
              {
                key: 'settings',
                label: 'Settings'
              }
            ]
          }}
        >
          <div className=" text-white text-lg flex flex-row justify-between m-2 items-center">
            <div className="flex flex-row items-center">
              <Icon type={Icon_type.icon_user} className="text-[40px] mr-2" />
              {appstore.cur_user?.username}
            </div>
            <DownOutlined className=" text-sm" />
          </div>
        </Dropdown>
        <MenuAntd
          theme="dark"
          mode="inline"
          items={treeDom}
          selectedKeys={chosedKey}
          {...(appset.fold_menu ? {} : { openKeys })}
          onOpenChange={(keys: string[]) => setOpenKeys(keys)}
          onSelect={(e) => {
            const menuinfo = menutree_info.datamap.get(e.key)
            if (menuinfo) {
              const params_keys: Key[] = []
              pathToRegexp(menuinfo.url, params_keys)
              location.push(menuinfo.url)
              setChosedKey([menuinfo.key])
            }
          }}
        />
      </div>
      {show_addvalut && (
        <AddValutPanel
          show={show_addvalut}
          title={'新增密码库'}
          show_type={ModalType.Add}
          show_del={false}
          onAddOk={async () => {
            await appstore.FetchAllValuts()
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
