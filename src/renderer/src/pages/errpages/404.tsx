import { Button } from 'antd'
import errimg from '@renderer/assets/error.gif'

export default function NotFound() {
  console.log('not found')
  return (
    <div className=" relative h-full flex items-center bg-white">
      <div>
        <div className=" text-9xl font-bold text-zinc-400">404</div>
        <div className=" text-4xl text-zinc-50">这里什么都没有</div>
        <Button>返回首页</Button>
      </div>
      <img className=" ml-[100px]" src={errimg + `?${Date.now()}`} />
    </div>
  )
}
