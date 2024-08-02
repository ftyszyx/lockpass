import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Select } from 'antd'

interface TimeSelectProps {
  value?: number
  onChange?: (value: number) => void
}
export default function TimeSelect(props: TimeSelectProps) {
  const apset = use_appset() as AppsetStore
  const lang = apset.lang
  return (
    <Select
      value={props.value}
      onChange={(value) => {
        props.onChange(value)
      }}
    >
      <Select.Option value={1}>{lang.getText('time.minute', 1)}</Select.Option>
      <Select.Option value={2}>{lang.getText('time.minute', 2)}</Select.Option>
      <Select.Option value={5}>{lang.getText('time.minute', 5)}</Select.Option>
      <Select.Option value={10}>{lang.getText('time.minute', 10)}</Select.Option>
      <Select.Option value={15}>{lang.getText('time.minute', 15)}</Select.Option>
      <Select.Option value={30}>{lang.getText('time.minute', 30)}</Select.Option>
      <Select.Option value={60}>{lang.getText('time.minute', 60)}</Select.Option>
      <Select.Option value={240}>{lang.getText('time.hour', 4)}</Select.Option>
      <Select.Option value={540}>{lang.getText('time.hour', 8)}</Select.Option>
      <Select.Option value={0}>{lang.getText('time.never')}</Select.Option>
    </Select>
  )
}
