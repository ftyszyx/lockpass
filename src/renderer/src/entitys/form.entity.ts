import { Rule } from 'antd/es/form'
import React from 'react'

export interface prop_field {
  [k: string]: any
  placeholder?: string
}

export class FieldInfo {
  field_name: string = ''
  field_Element: React.ElementType
  label?: string = ''
  //edit 相关
  edit_rules?: Rule[] = []
  edit_props?: prop_field = {}
}
