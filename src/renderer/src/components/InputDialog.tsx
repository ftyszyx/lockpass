import { Input, Modal } from 'antd'
import { useState } from 'react'

interface InputDialogProps {
  show: boolean
  title: string
  input_text: string
  style?: React.CSSProperties
  onOk: (value: string) => void
  onClose: () => void
  className?: string
}
export default function InputDialog(props: InputDialogProps): JSX.Element {
  const [inputstr, setInputstr] = useState(props.input_text || '')
  return (
    <Modal
      open={props.show}
      title={props.title}
      onCancel={() => {
        props.onClose()
      }}
      onOk={() => {
        props.onOk(inputstr)
      }}
      className={props.className || ''}
      style={props.style}
    >
      <div className="flex flex-col">
        <Input
          defaultValue={inputstr}
          onChange={(e) => {
            setInputstr(e.target.value)
          }}
        />
      </div>
    </Modal>
  )
}
