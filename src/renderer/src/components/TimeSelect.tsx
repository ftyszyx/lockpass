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
    <Select value={props.value} onChange={props.onChange}>
      <Select.Option value={1}>{lang.getLangFormat('time.second', 1)}</Select.Option>
      <Select.Option value={2}>{lang.getLangFormat('time.second', 2)}</Select.Option>
      <Select.Option value={5}>{lang.getLangFormat('time.second', 5)}</Select.Option>
      <Select.Option value={10}>{lang.getLangFormat('time.second', 10)}</Select.Option>
      <Select.Option value={15}>{lang.getLangFormat('time.second', 15)}</Select.Option>
      <Select.Option value={30}>{lang.getLangFormat('time.second', 30)}</Select.Option>
      <Select.Option value={60}>{lang.getLangFormat('time.second', 60)}</Select.Option>
      <Select.Option value={240}>{lang.getLangFormat('time.hour', 4)}</Select.Option>
      <Select.Option value={540}>{lang.getLangFormat('time.hour', 8)}</Select.Option>
      <Select.Option value={0}>{lang.getLangText('time.never')}</Select.Option>
    </Select>
  )
}
