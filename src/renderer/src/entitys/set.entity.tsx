import { Switch } from 'antd'
import { FieldInfo, FiledProps } from './form.entity'
import TimeSelect from '@renderer/components/TimeSelect'

export const NormalSetFiledList: FieldInfo[] = [
  {
    field_name: 'normal_aulock_time',
    render: (props: FiledProps) => {
      return <TimeSelect {...props} />
    },
    edit_rules: [{ required: true, message: '请输入自动锁定时间' }],
    edit_props: { placeholder: '请输入自动锁定时间' },
    label: '自动锁定时间'
  },
  {
    field_name: 'normal_lock_with_pc',
    render: (props: FiledProps) => {
      return <Switch {...props} />
    },
    edit_props: { placeholder: '电脑锁定，软件也锁定' },
    label: '电脑锁定，软件也锁定'
  }
]
