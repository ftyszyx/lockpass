import { Rule } from 'antd/es/form'

export interface prop_field {
  [k: string]: any
  placeholder?: string
}

export class FieldInfo {
  field_name: string = ''
  field_Element: any = null
  label: string = ''
  //edit 相关
  edit_rules?: Rule[] = []
  edit_props?: prop_field = {}
}
