import { use_appset } from '@renderer/models/appset.model'
import { Input, InputRef, Modal } from 'antd'
import { useEffect, useRef, useState } from 'react'

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
  const getText = use_appset((state) => state.getText)
  const inputref = useRef<InputRef>(null)
  useEffect(() => {
    if (inputref.current) {
      inputref.current.focus()
    }
  }, [])
  return (
    <Modal
      open={props.show}
      title={props.title}
      onCancel={() => {
        props.onClose()
      }}
      onOk={async () => {
        await props.onOk(inputstr)
      }}
      okText={getText('ok')}
      cancelText={getText('cancel')}
      okButtonProps={{ htmlType: 'submit' }}
      className={props.className || ''}
      style={props.style}
    >
      <div className="flex flex-col">
        <Input
          ref={inputref}
          defaultValue={inputstr}
          onChange={(e) => {
            setInputstr(e.target.value)
          }}
        />
      </div>
    </Modal>
  )
}
