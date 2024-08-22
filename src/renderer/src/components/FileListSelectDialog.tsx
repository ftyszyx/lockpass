import { BackupFileItem } from '@common/entitys/backup.entity'
import { FormatTime, getFileSize } from '@common/help'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Modal } from 'antd'

interface FileListSelectDialogProps {
  filelist: BackupFileItem[]
  show: boolean
  className?: string
  style?: React.CSSProperties
  onOk: (value: BackupFileItem) => void
  onClose: () => void
}
export default function FileListSelectDialog(props: FileListSelectDialogProps): JSX.Element {
  const appset = use_appset() as AppsetStore
  return (
    <Modal
      className={props.className ? props.className : ''}
      open={props.show}
      title={appset.getText('backupfilelistselect.title')}
      style={props.style}
      footer={null}
      onCancel={() => {
        props.onClose()
      }}
    >
      <div className=" flex flex-col">
        <div className=" flex flex-row font-sans font-bold ">
          <span className="w-[50%]">{appset.getText('filelistselect.name')}</span>
          <span className="w-[40%]">{appset.getText('filelistselect.updatetime')}</span>
          <span className="w-[10%]">{appset.getText('filelistselect.size')}</span>
        </div>
        {props.filelist.map((item) => {
          const updateat = new Date(item.updated_at)
          return (
            <div
              onClick={() => {
                props.onOk(item)
              }}
              key={item.file_id}
              className="flex flex-row py-2 border-b-2 border-solid border-gray-200 cursor-pointer hover:bg-green-300 rounded-sm"
            >
              <span className="w-[50%]">{item.name}</span>
              <span className="w-[40%]">{FormatTime(updateat)}</span>
              <span className="w-[15%]">{getFileSize(item.size)}</span>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
