import { BackupFileItem } from '@common/entitys/drive.entity'
import { FormatTime, getFileSize } from '@common/help'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Button, Modal } from 'antd'

interface FileListSelectDialogProps {
  filelist: BackupFileItem[]
  show: boolean
  className?: string
  style?: React.CSSProperties
  onOk: (value: BackupFileItem) => void
  onDelete: (value: BackupFileItem) => Promise<void>
  onTrash: (value: BackupFileItem) => Promise<void>
  onClose: () => void
}
export default function FileListSelectDialog(props: FileListSelectDialogProps): JSX.Element {
  const appset = use_appset() as AppsetStore
  return (
    <Modal
      className={props.className ? props.className : ''}
      open={props.show}
      title={appset.getText('backupfilelistselect.title')}
      footer={null}
      onCancel={() => {
        props.onClose()
      }}
    >
      <div className=" flex flex-col">
        <div className=" flex flex-row font-sans font-bold ">
          <span className="w-[40%]">{appset.getText('filelistselect.name')}</span>
          <span className="w-[20%]">{appset.getText('filelistselect.updatetime')}</span>
          <span className="w-[20%]">{appset.getText('filelistselect.size')}</span>
          <span className="w-[20%]">{appset.getText('filelistselect.oper')}</span>
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
              <span className="w-[40%]">{item.name}</span>
              <span className="w-[20%]">{FormatTime(updateat)}</span>
              <span className="w-[20%]">{getFileSize(item.size)}</span>
              <div className="w-[20%]">
                <Button
                  type="primary"
                  className="w-full"
                  onClick={async (e) => {
                    e.stopPropagation()
                    await props.onTrash(item)
                  }}
                >
                  {appset.getText('trash')}
                </Button>
                <Button
                  className="w-full"
                  onClick={async (e) => {
                    e.stopPropagation()
                    await props.onDelete(item)
                  }}
                >
                  {appset.getText('delete')}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
