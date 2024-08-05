import { InputNumber, Select, Slider, Switch } from 'antd'
import { FieldInfo } from './form.entity'
import { LangHelper } from '@common/lang'
import { PasswordSeparatorType } from '@common/entitys/password.entity'

export const PasswordTypeFileList: FieldInfo[] = [
  {
    field_name: 'random_characters_len',
    render(props: any) {
      return (
        <div className="flex flex-row space-x-2">
          <Slider min={8} max={50} {...props} className="flex-grow"></Slider>
          <InputNumber min={8} max={50} {...props} size="small" className="w-[60px]"></InputNumber>
        </div>
      )
    }
  },
  {
    field_name: 'random_number',
    render(props: any) {
      return <Switch {...props}></Switch>
    }
  },
  {
    field_name: 'random_symbol',
    render(props: any) {
      return <Switch {...props}></Switch>
    }
  },
  {
    field_name: 'random_capitalize',
    render(props: any) {
      return <Switch {...props}></Switch>
    }
  },
  {
    field_name: 'memory_words_num',
    render(props: any) {
      return (
        <div className="flex flex-row space-x-2">
          <Slider min={3} max={15} {...props} className="flex-grow"></Slider>
          <InputNumber min={3} max={15} {...props} size="small" className="w-[60px]"></InputNumber>
        </div>
      )
    }
  },
  {
    field_name: 'memory_capitalize',
    render(props: any) {
      return <Switch {...props}></Switch>
    }
  },
  {
    field_name: 'memory_word_full',
    render(props: any) {
      return <Switch {...props}></Switch>
    }
  },
  {
    field_name: 'memory_separator',
    render(props: any) {
      return (
        <Select {...props}>
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
        <div className="flex flex-row space-x-2">
          <Slider min={3} max={12} {...props} className="flex-grow"></Slider>
          <InputNumber min={3} max={12} {...props} size="small" className="w-[60px]"></InputNumber>
        </div>
      )
    }
  }
]
