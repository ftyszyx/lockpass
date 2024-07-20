/* 用于菜单的自定义图标 */
// import { createFromIconfontCN } from "@ant-design/icons";
// const IconFont = createFromIconfontCN({
//   scriptUrl: "//at.alicdn.com/t/c/font_4582429_tpo90l32irp.js",
// });

import React from 'react'

interface Props {
  type: string
  className?: string | undefined
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

export default function Icon(props: Props): JSX.Element {
  return (
    <span className={`iconfont ${props.type} ${props.className}`} onClick={props.onClick}></span>
  )
  // return <IconFont type={props.type} className={props.className} />;
}
