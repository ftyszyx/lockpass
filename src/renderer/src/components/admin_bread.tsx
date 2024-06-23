/** 通用动态面包屑 **/
import { useMemo } from 'react'
import { useHistory } from '@renderer/libs/router'
import { Breadcrumb } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import { pathToRegexp } from 'path-to-regexp'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { getAllMenus } from '@renderer/entitys/menu.entity'
export default function MyBread(): JSX.Element {
  const location = useHistory()
  /** 根据当前location动态生成对应的面包屑 **/
  const breads = useMemo(() => {
    const now_url = location.PathName
    const breads: BreadcrumbItemType[] = []
    const allmenus = getAllMenus()
    for (let i = 0; i < allmenus.length; i++) {
      let menuinfo = allmenus[i]
      const regs = pathToRegexp(menuinfo.url, [], { end: true, start: true })
      if (regs.test(now_url)) {
        breads.push({ title: menuinfo.title })
        while (menuinfo.parent != null && menuinfo.parent != '0') {
          const new_menun = allmenus.find((x) => x.id.toString() == menuinfo?.parent)
          if (new_menun == null) {
            break
          }
          breads.push({ title: new_menun.title })
          menuinfo = new_menun
        }
        breads.reverse()
        break
      }
    }
    return breads
  }, [location.PathName])

  return (
    <div className=" p-2 flex items-center">
      <EnvironmentOutlined className=" float-none text-green-500 mr-2" />
      <Breadcrumb items={breads} />
    </div>
  )
}
