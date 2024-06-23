import { PagePath } from './page.entity'

export interface MyMenuType {
  id: number // ID,添加时可以没有id
  title: string // 标题
  icon_style_type: string // 图标
  url: string // 链接路径
  parent: string // 父级ID
  sorts: number // 排序编号
  children?: number[] // 子菜单
}
export const allMenus: MyMenuType[] = [
  {
    id: 1,
    title: '概况',
    sorts: 1,
    icon_style_type: 'icon-home',
    parent: '0',
    url: PagePath.AdminHome
  }
]

export function getAllMenus() {
  return allMenus
}
export const MenuParamNull = 'null'
