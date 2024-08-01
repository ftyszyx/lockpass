import { Select, Switch } from 'antd'
import { FieldInfo, FiledProps } from './form.entity'
import TimeSelect from '@renderer/components/TimeSelect'
import { ShortCutSet } from '@common/entitys/app.entity'

export interface NormalSet {
  aulock_time: number //自动锁定时间,单位分钟
  lock_with_pc: boolean //电脑锁定，软件也锁定
}

export interface UserSetInfo {
  normal: NormalSet
  global_shortcut: ShortCutSet[]
  local_shortcut: ShortCutSet[]
}

export const NormalSetFiledList: FieldInfo[] = [
  {
    field_name: 'aulock_time',
    render: (props: FiledProps) => {
      return <TimeSelect {...props} />
    },
    edit_rules: [{ required: true, message: '请输入自动锁定时间' }],
    edit_props: { placeholder: '请输入自动锁定时间' },
    label: '自动锁定时间'
  },
  {
    field_name: 'lock_with_pc',
    render: (props: FiledProps) => {
      return <Switch {...props} />
    },
    edit_props: { placeholder: '电脑锁定，软件也锁定' },
    label: '电脑锁定，软件也锁定'
  }
]
