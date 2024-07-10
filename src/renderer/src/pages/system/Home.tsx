import { Vault } from '@common/entitys/valuts.entity'
import { Icon_type } from '@common/gloabl'
import Icon from '@renderer/components/icon'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { Button, Form, Input, Modal, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import TextArea from 'antd/es/input/TextArea'
import { useEffect, useState } from 'react'
const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } }
export default function Home() {
  console.log('home render')
  const [form] = useForm()
  const [show_edit, setShowEdit] = useState(false)
  const [edit_panel_title, setEditPanelTitle] = useState('')
  const [init_value, setInitValue] = useState({} as Vault)
  const appstore = use_appstore() as AppStore
  useEffect(() => {
    getAllData()
  }, [])
  async function getAllData() {
    await appstore.FetchAllValuts()
  }

  return (
    <div>
      <div className=" bg-gray-100 p-8">
        <div className=" container mx-auto">
          <h1 className="text-2xl font-semibold mb-4">密码库</h1>
          <Button
            type="primary"
            onClick={() => {
              setEditPanelTitle('新增密码库')
              setInitValue({} as Vault)
              setShowEdit(true)
            }}
          >
            新增
          </Button>
          <div className="flex space-x-4 flex-wrap">
            {appstore.vaults.map((valut) => {
              return (
                <div
                  key={valut.id}
                  className=" bg-white shadow-md rounded-lg p-4 w-64 border-t-4 border-purple-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{valut.name}</h2>
                    <Icon type="{valut.icon}" className=" w-8 h-8" />
                  </div>
                  <p className=" text-gray-600 mb-4">{valut.info}</p>
                  <div className="flex justify-between items-center ">
                    <Icon type="icon-set" className=" text-gray-400"></Icon>
                    <Icon type="icon-goto" className=" text-gray-400"></Icon>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {show_edit && (
        <Modal
          width={400}
          title={edit_panel_title}
          open={show_edit}
          onOk={() => {
            form.validateFields().then(async (values) => {
              console.log(values)
              await appstore.AddValut(values as Vault)
              setShowEdit(false)
            })
          }}
          onCancel={() => {
            setShowEdit(false)
          }}
        >
          <Form {...formItemLayout} form={form} initialValues={init_value}>
            <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
              <Input></Input>
            </Form.Item>
            <Form.Item label="图标" name="icon" rules={[{ required: true, message: '请输入图标' }]}>
              <Select>
                {Object.keys(Icon_type).map((key) => {
                  return (
                    <Select.Option key={key} value={Icon_type[key]}>
                      <Icon type={Icon_type[key]}></Icon>
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item label="信息" name="info" rules={[{ required: true, message: '请输入信息' }]}>
              <TextArea showCount style={{ height: 120 }}></TextArea>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  )
}
