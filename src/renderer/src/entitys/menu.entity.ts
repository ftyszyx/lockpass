import { PagePath } from '@common/entitys/page.entity'
import { Icon_type } from '@common/gloabl'
export const MenuValutID = 1
export const MenuSetID = 2

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
    id: MenuValutID,
    title: '保险库',
    sorts: 1,
    icon_style_type: Icon_type.icon_lock,
    parent: '0',
    url: ''
  },
  {
    id: MenuSetID,
    title: '设置',
    sorts: 2,
    icon_style_type: Icon_type.icon_set,
    parent: '0',
    url: PagePath.Admin_set
  }
]

export function getAllMenus() {
  return allMenus
}
export const MenuParamNull = 'null'
