import { VaultImportType } from '@common/entitys/vault_item.entity'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Modal } from 'antd'
import Icon from './Icon'

interface ImportCsvSelectTypeProps {
  show: boolean
  className?: string
  style?: React.CSSProperties
  onOk: (value: VaultImportType) => Promise<void>
  onClose: () => void
}
export default function ImportCsvSelectType(props: ImportCsvSelectTypeProps): JSX.Element {
  const appset = use_appset() as AppsetStore
  return (
    <Modal
      className={props.className ? props.className : ''}
      open={props.show}
      title={appset.getText('importcsvtype.title')}
      style={props.style}
      footer={null}
      onCancel={() => {
        props.onClose()
      }}
    >
      <div className=" flex flex-row flex-wrap">
        {Object.keys(VaultImportType).map((key) => {
          return (
            <div
              onClick={async () => {
                await props.onOk(VaultImportType[key])
              }}
              key={key}
              className=" w-[100px] h-[100px] flex flex-col items-center mr-2 mb-2 py-2  border-2 border-solid border-gray-200 cursor-pointer hover:bg-green-300 rounded-xl "
            >
              <Icon type={`icon-${VaultImportType[key]}`} className="w-[40px] h-[40px] mb-2" svg />
              <span className="flex-1">
                {appset.getText(`importcsvtype.${VaultImportType[key]}`)}
              </span>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
