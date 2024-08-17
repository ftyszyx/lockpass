import { PagePath } from '@common/entitys/page.entity'
import { Icon_type } from '@common/gloabl'
import { LangItem } from '@common/lang'
import Icon from '@renderer/components/Icon'
import { ReactNode } from 'react'
//id list
export const MenuValutID = 1
export const MenuSetID = 2
export const MenuLog = 3

export const MenuVaultBaseId = 1000
//event list
export const ValutAddEvent = 'ValutAddEvent'

export interface MyMenuType {
  id: number // ID,添加时可以没有id
  key: string
  title: string | ReactNode // 标题
  icon_style_type: string // 图标
  url: string // 链接路径
  parent: string // 父级ID
  sorts: number // 排序编号
  children?: number[] // 子菜单
  label?: string | ReactNode
  icon?: ReactNode
}

interface AllMenuProps {
  CallEvent: (event: string) => Promise<void>
  lang: LangItem
}

export function getAllMenus(props: AllMenuProps): MyMenuType[] {
  return [
    {
      id: MenuValutID,
      key: MenuValutID + '',
      title: (
        <div className="flex flex-row items-center">
          <div key={'title'}>{props.lang?.getText('menu.vault')}</div>
          <Icon
            key="icon"
            className=" ml-5"
            type={Icon_type.icon_add}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              props.CallEvent(ValutAddEvent)
            }}
          ></Icon>
        </div>
      ),
      sorts: 1,
      icon_style_type: Icon_type.icon_lock,
      parent: '0',
      url: ''
    },
    {
      id: MenuSetID,
      key: MenuSetID + '',
      title: props.lang?.getText('menu.setting'),
      sorts: 2,
      icon_style_type: Icon_type.icon_set,
      parent: '0',
      url: PagePath.Admin_set
    }
    // {
    //   id: MenuLog,
    //   key: MenuLog + '',
    //   title: '日志',
    //   sorts: 3,
    //   icon_style_type: Icon_type.icon_note,
    //   parent: '0',
    //   url: PagePath.Admin_log
    // }
  ]
}
export const MenuParamNull = 'null'
