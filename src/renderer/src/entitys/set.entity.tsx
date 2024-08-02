import { Switch } from 'antd'
import { FieldInfo, FiledProps } from './form.entity'
import TimeSelect from '@renderer/components/TimeSelect'

export const NormalSetFiledList: FieldInfo[] = [
  {
    field_name: 'normal_autolock_time',
    render: (props: FiledProps) => {
      return <TimeSelect {...props} />
    },
    edit_rules: [{ required: true, message: '请输入自动锁定时间' }]
  },
  {
    field_name: 'normal_lock_with_pc',
    render: (props: FiledProps) => {
      return <Switch {...props} />
    }
  }
]
export enum SetMenuItem {
  normal = 'normal',
  shortcut_global = 'shortcut_global',
  shortcut_local = 'shortcut_local'
}
