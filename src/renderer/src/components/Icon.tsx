/* 用于菜单的自定义图标 */
// import { createFromIconfontCN } from "@ant-design/icons";
// const IconFont = createFromIconfontCN({
//   scriptUrl: "//at.alicdn.com/t/c/font_4582429_tpo90l32irp.js",
// });

import React from 'react'

interface Props {
  svg?: boolean
  type: string
  key?: string
  className?: string | undefined
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

export default function Icon(props: Props): JSX.Element {
  return props.svg ? (
    <div onClick={props.onClick}>
      <svg className={`icon ${props.className}`} aria-hidden="true">
        <use xlinkHref={`#${props.type}`}></use>
      </svg>
    </div>
  ) : (
    <span
      key={props.key}
      className={`iconfont ${props.type} ${props.className || ''}`}
      onClick={props.onClick}
    ></span>
  )
}
