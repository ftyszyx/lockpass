import { Icon_type, VaultItemType } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import { Modal, Space } from 'antd'

interface SelectPasswordTypeProps {
  show: boolean
  onOk?: (password_type: VaultItemType) => Promise<void>
  onClose: () => void
}
export default function SelectPasswordTypePanel(props: SelectPasswordTypeProps): JSX.Element {
  return (
    <div>
      <Modal
        className="w-[500px]"
        title="选择密码类型"
        open={props.show}
        onCancel={() => props.onClose()}
        onClose={() => props.onClose}
      >
        <div className="flex flex-row flex-wrap">
          {Object.keys(VaultItemType).map((key) => {
            return (
              <div
                className="bg-gray-200 hover:bg-blue-300 hover:cursor-pointer m-2 p-2 rounded-lg w-[210px] h-[40px] flex flex-row justify-between items-center"
                key={key}
                onClick={() => {
                  props.onOk?.(VaultItemType[key])
                }}
              >
                <Space>
                  <Icon svg className="" type={`icon-${VaultItemType[key]}`} />
                  {VaultItemType[key]}
                </Space>
                <Icon type={Icon_type.icon_add} />
              </div>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}
