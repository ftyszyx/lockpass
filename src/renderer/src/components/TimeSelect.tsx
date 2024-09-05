import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Select } from 'antd'

interface TimeSelectProps {
  value?: number
  onChange?: (value: number) => void
}
export default function TimeSelect(props: TimeSelectProps) {
  const appset = use_appset() as AppsetStore
  return (
    <Select
      value={props.value}
      onChange={(value) => {
        props.onChange(value)
      }}
    >
      <Select.Option value={1}>{appset.getText('time.minute', 1)}</Select.Option>
      <Select.Option value={2}>{appset.getText('time.minute', 2)}</Select.Option>
      <Select.Option value={5}>{appset.getText('time.minute', 5)}</Select.Option>
      <Select.Option value={10}>{appset.getText('time.minute', 10)}</Select.Option>
      <Select.Option value={15}>{appset.getText('time.minute', 15)}</Select.Option>
      <Select.Option value={30}>{appset.getText('time.minute', 30)}</Select.Option>
      <Select.Option value={60}>{appset.getText('time.minute', 60)}</Select.Option>
      <Select.Option value={240}>{appset.getText('time.hour', 4)}</Select.Option>
      <Select.Option value={540}>{appset.getText('time.hour', 8)}</Select.Option>
      <Select.Option value={0}>{appset.getText('time.never')}</Select.Option>
    </Select>
  )
}
