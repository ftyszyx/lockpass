import { InputNumber, Select, Slider, Switch } from 'antd'
import { FieldInfo } from './form.entity'
import { LangHelper } from '@common/lang'
import { PasswordSeparatorType } from '@common/entitys/password.entity'

export const PasswordTypeFileList: FieldInfo[] = [
  {
    field_name: 'random_characters_len',
    render(props: any) {
      return (
        <div className="flex flex-row">
          <Slider min={8} max={50} {...props} className="flex-grow"></Slider>
          <InputNumber min={8} max={50} {...props} size="small" className="w-[60px]"></InputNumber>
        </div>
      )
    }
  },
  {
    field_name: 'random_number',
    render() {
      return <Switch></Switch>
    }
  },
  {
    field_name: 'random_symbol',
    render() {
      return <Switch></Switch>
    }
  },
  {
    field_name: 'random_capitalize',
    render() {
      return <Switch></Switch>
    }
  },
  {
    field_name: 'memory_words_num',
    render(props: any) {
      return (
        <div className="flex flex-row">
          <Slider min={3} max={15} {...props} className="flex-grow"></Slider>
          <InputNumber min={3} max={15} {...props} size="small" className="w-[60px]"></InputNumber>
        </div>
      )
    }
  },
  {
    field_name: 'memory_capitalize',
    render() {
      return <Switch></Switch>
    }
  },
  {
    field_name: 'memory_word_full',
    render() {
      return <Switch></Switch>
    }
  },
  {
    field_name: 'memory_separator',
    render() {
      return (
        <Select>
          {Object.keys(PasswordSeparatorType).map((key) => {
            return (
              <Select.Option value={PasswordSeparatorType[key]} key={key}>
                {LangHelper.getString(`passwordSeparator.${key}`)}
              </Select.Option>
            )
          })}
        </Select>
      )
    }
  },
  {
    field_name: 'pin_code_num',
    render(props: any) {
      return (
        <div className="flex flex-row">
          <Slider min={3} max={12} {...props} className="flex-grow"></Slider>
          <InputNumber min={3} max={12} {...props} size="small" className="w-[60px]"></InputNumber>
        </div>
      )
    }
  }
]
