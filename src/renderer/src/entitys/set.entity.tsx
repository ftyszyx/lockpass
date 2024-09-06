import { Select, Switch } from 'antd'
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
  },
  {
    field_name: 'normal_autoupdate',
    render: (props: FiledProps) => {
      return <Switch {...props} />
    }
  },
  {
    field_name: 'normal_poweron_open',
    render: (props: FiledProps) => {
      return <Switch {...props} />
    }
  },
  {
    field_name: 'normal_lang_set',
    render: (props: FiledProps) => {
      // const appset = use_appset() as AppsetStore
      return (
        <Select {...props}>
          <Select.Option value="zh-cn">简体中文</Select.Option>
          <Select.Option value="en-us">English</Select.Option>
        </Select>
      )
    }
    // render:
  }
]
export enum SetMenuItem {
  normal = 'normal',
  shortcut_global = 'shortcut_global',
  shortcut_local = 'shortcut_local'
}
