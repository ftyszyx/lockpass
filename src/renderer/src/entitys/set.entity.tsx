import { Select, Switch } from 'antd'
import { FieldInfo } from './form.entity'
import TimeSelect from '@renderer/components/TimeSelect'

export interface UserSetInfo {
  aulock_time: number //自动锁定时间,单位分钟
  lock_with_pc: boolean //电脑锁定，软件也锁定
}

export const UserSetFieldList: FieldInfo[] = [
  {
    field_name: 'aulock_time',
    render: TimeSelect,
    edit_rules: [{ required: true, message: '请输入自动锁定时间' }],
    edit_props: { placeholder: '请输入自动锁定时间' },
    label: '自动锁定时间'
  },
  {
    field_name: 'lock_with_pc',
    render: Switch,
    edit_props: { placeholder: '电脑锁定，软件也锁定' },
    label: '电脑锁定，软件也锁定'
  }
]
