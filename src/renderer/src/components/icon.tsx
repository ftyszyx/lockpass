import '@renderer/assets/iconfont/iconfont.css'
/* 用于菜单的自定义图标 */
// import { createFromIconfontCN } from "@ant-design/icons";
// const IconFont = createFromIconfontCN({
//   scriptUrl: "//at.alicdn.com/t/c/font_4582429_tpo90l32irp.js",
// });

interface Props {
  type: string
  className?: string | undefined
}

export default function Icon(props: Props): JSX.Element {
  return <span className={`iconfont ${props.type} ${props.className}`}></span>
  // return <IconFont type={props.type} className={props.className} />;
}
