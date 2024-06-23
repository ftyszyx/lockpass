/* Footer 页面底部 */
import { Layout } from 'antd'
import { AUTHOR, AUTHOR_WEB } from '@renderer/const'

const { Footer } = Layout

export default function MyFooter() {
  return (
    <Footer className="text-center flex-none py-4 ">
      © {new Date().getFullYear() + ' '}
      <a href={AUTHOR_WEB} target="_blank" rel="author" className=" hover:underline">
        {AUTHOR}
      </a>
      , Inc.
    </Footer>
  )
}
