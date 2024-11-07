import { ModalType, VaultItemTypeIcon, VaultItemType } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import IconSelect from '@renderer/components/IconSelect'
import MyInputWrapper from '@renderer/components/MyInputWrapper'
import { FieldInfo } from '@renderer/entitys/form.entity'
import { GetPasswordFilelist } from '@renderer/entitys/Vault_item.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Form, Input, Select, Upload, Image, UploadFile, UploadProps, GetProp } from 'antd'
import ImgCrop from 'antd-img-crop'
import TextArea, { TextAreaProps } from 'antd/es/input/TextArea'
import { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'

interface props {
  passwordType: VaultItemType
  modal_type: ModalType
  className?: string
  InputClassName?: string
  onPicsChange: (pics: string) => void
  pics: string
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
export default function PaswordDetail(props: props) {
  ConsoleLog.info('PaswordDetail render', props)
  const lang = use_appset((state) => state.lang) as AppsetStore['lang']
  const vaults = use_appstore((state) => state.vaults) as AppStore['vaults']
  const [imglist, setImglist] = useState<UploadFile[]>(props.pics ? JSON.parse(props.pics) : [])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  const getText = use_appset((state) => state.getText) as AppsetStore['getText']
  return (
    <>
      <div className="flex flex-row items-center space-x-2 ">
        <Form.Item name="icon">
          <IconSelect
            show_type={props.modal_type}
            items={Object.keys(VaultItemTypeIcon).map((key) => {
              return {
                value: VaultItemTypeIcon[key],
                label: <Icon type={VaultItemTypeIcon[key]} className=" w-[40px] h-[40px]" svg />
              }
            })}
          ></IconSelect>
        </Form.Item>
        <Form.Item name="name" className="flex-grow">
          <MyInputWrapper
            inputElement={Input}
            inputProps={{ placeholder: getText('name') }}
            show_type={props.modal_type}
          />
        </Form.Item>
      </div>
      <Form.Item name="vault_id" label={getText('vaultitem.label.vault_id')}>
        <Select>
          {vaults.map((item) => {
            return (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>
      <div>
        {GetPasswordFilelist(props.passwordType, lang).map((item: FieldInfo) => {
          return (
            <Form.Item
              className=" mb-2  "
              name={['info', item.field_name]}
              label={item.hide_label ? '' : getText(`vaultitem.label.${item.field_name}`)}
              rules={item.edit_rules}
              key={item.field_name}
            >
              <item.render
                show_type={props.modal_type}
                placeholder={getText(`vaultitem.placeholder.${item.field_name}`)}
              ></item.render>
            </Form.Item>
          )
        })}
      </div>
      <Form.Item className="mb-0" name="remarks" label={getText('vaultadd.remarks')}>
        <MyInputWrapper<TextAreaProps>
          inputProps={{ autoSize: { minRows: 4 } }}
          inputElement={TextArea}
          show_type={props.modal_type}
        ></MyInputWrapper>
      </Form.Item>
      <div className="flex flex-col">
        <div>{getText('vault.item.pics')}</div>
        <ImgCrop rotationSlider>
          <Upload
            listType="picture-card"
            fileList={imglist}
            onRemove={() => {
              return props.modal_type != ModalType.View
            }}
            onPreview={async (file: UploadFile) => {
              if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj as FileType)
              }

              setPreviewImage(file.url || (file.preview as string))
              setPreviewOpen(true)
            }}
            onChange={async (info) => {
              for (let i = 0; i < info.fileList.length; i++) {
                const fileinfo = info.fileList[i]
                fileinfo.url = await getBase64(fileinfo.originFileObj as FileType)
              }
              setImglist(info.fileList)
            }}
          >
            {imglist.length >= 8 || props.modal_type == ModalType.View ? null : uploadButton}
          </Upload>
        </ImgCrop>
      </div>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage('')
          }}
          src={previewImage}
        />
      )}
    </>
  )
}
