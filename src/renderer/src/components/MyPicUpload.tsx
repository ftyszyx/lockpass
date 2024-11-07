import ImgCrop from 'antd-img-crop'
import { Upload, Image, UploadFile, UploadProps, GetProp } from 'antd'
import { useState } from 'react'
import { ModalType } from '@common/gloabl'
import { PlusOutlined } from '@ant-design/icons'

interface MyPicUploadProps {
  value?: string
  show_type: ModalType
  onChange?: (pics: string) => void
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
export default function MyPicUpload(props: MyPicUploadProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [imglist, setImglist] = useState<UploadFile[]>(props.value ? JSON.parse(props.value) : [])
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  function GetPics(pics: UploadFile[]): UploadFile[] {
    const img_data: UploadFile[] = []
    for (let i = 0; i < pics.length; i++) {
      const newinfo: UploadFile = {
        uid: pics[i].uid,
        url: pics[i].url,
        size: pics[i].size,
        name: pics[i].name,
        type: pics[i].type
      }
      img_data.push(newinfo)
    }
    return img_data
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )
  return (
    <>
      <ImgCrop rotationSlider>
        <Upload
          listType="picture-card"
          fileList={imglist}
          onRemove={() => {
            return props.show_type != ModalType.View
          }}
          onPreview={async (file: UploadFile) => {
            if (!file.url && !file.preview) {
              file.preview = await getBase64(file.originFileObj as FileType)
            }

            setPreviewImage(file.url || (file.preview as string))
            setPreviewOpen(true)
          }}
          onChange={async (info) => {
            if (!info.file.url) {
              info.file.url = await getBase64(info.file.originFileObj as FileType)
            }
            setImglist(info.fileList)
            props.onChange(JSON.stringify(GetPics(info.fileList)))
          }}
        >
          {props.show_type == ModalType.View ? null : uploadButton}
        </Upload>
      </ImgCrop>
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
