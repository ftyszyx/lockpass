import { InputHTMLAttributes, useState } from 'react'
import Icon from './Icon'
import { Icon_type, ModalType } from '@common/gloabl'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import MyInputWrapper from './MyInputWrapper'
import { Input } from 'antd'

interface InputArrProps {
  value?: string[]
  placeholder?: string
  label: string
  show_type?: ModalType
  readonly?: boolean
  onChange?: (newValue: string[]) => void // 添加一个onChange回调函数来传递数据
}

export default function InputArr(props: InputArrProps) {
  const appset = use_appset() as AppsetStore
  const [inputs, setInputs] = useState<string[]>(props.value || [''])
  const handleInputChange = (index: number, newValue: string) => {
    const newInputs = [...inputs]
    newInputs[index] = newValue
    setInputs(newInputs)
    props.onChange(newInputs) // 当输入改变时，调用onChange回调函数
  }

  const handleAddInput = () => {
    setInputs([...inputs, ''])
    props.onChange([...inputs, '']) // 添加新输入时，更新外部状态
  }

  const handleRemoveInput = (index: number) => {
    let newinputs = [].concat(inputs)
    newinputs.splice(index, 1)
    setInputs(newinputs)
    props.onChange(newinputs) // 移除输入时，更新外部状态
  }

  return (
    <div className="flex flex-col">
      <div className=" flex flex-col">
        {inputs.map((input_value, index) => (
          <div
            key={index}
            className=" p-1 rounded-lg flex flex-row items-center  border-solid mb-1 bg-gray-200"
          >
            <div className="flex flex-col flex-grow">
              <div>{props.label}</div>
              <MyInputWrapper<InputHTMLAttributes<HTMLInputElement>>
                inputProps={{ placeholder: props.placeholder || '' }}
                inputElement={Input}
                onChange={(e) => handleInputChange(index, e.target.value)}
                value={input_value}
              />
            </div>
            {!props.readonly && (
              <div onClick={() => handleRemoveInput(index)} className=" cursor-pointer">
                <Icon className="w-[20px] h-[20px]" type={Icon_type.icon_del} svg />
              </div>
            )}
          </div>
        ))}
      </div>
      {!props.readonly && (
        <div
          onClick={handleAddInput}
          className=" cursor-pointer flex flex-row space-x-1 items-center bg-gray-300 rounded-lg border-[1px] px-3 py-1"
        >
          <Icon type={Icon_type.icon_add} />
          <div>{appset.lang.getText('inputarr.addmore')}</div>
        </div>
      )}
    </div>
  )
}
