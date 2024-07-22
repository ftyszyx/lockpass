import { useState } from 'react'
import Icon from './icon'
import { Icon_type } from '@common/gloabl'

interface InputArrProps {
  value: string[]
  label: string
  onChange: (newValue: string[]) => void // 添加一个onChange回调函数来传递数据
}

export default function InputArr({ value, label, onChange }: InputArrProps) {
  const [inputs, setInputs] = useState<string[]>(value)

  const handleInputChange = (index: number, newValue: string) => {
    const newInputs = [...inputs]
    newInputs[index] = newValue
    setInputs(newInputs)
    onChange(newInputs) // 当输入改变时，调用onChange回调函数
  }

  const handleAddInput = () => {
    setInputs([...inputs, ''])
    onChange([...inputs, '']) // 添加新输入时，更新外部状态
  }

  const handleRemoveInput = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index)
    setInputs(newInputs)
    onChange(newInputs) // 移除输入时，更新外部状态
  }

  return (
    <div>
      <label>{label}</label>
      {inputs.map((input, index) => (
        <div key={index}>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
          <Icon type={Icon_type.icon_del} onClick={() => handleRemoveInput(index)} />
        </div>
      ))}
      <button onClick={handleAddInput}>Add More</button>
    </div>
  )
}
