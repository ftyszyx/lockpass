import { Button } from 'antd'
import errimg from '@renderer/assets/error.gif'

export default function NotFound() {
  console.log('render not found')
  return (
    <div className=" h-full flex items-center bg-white">
      <div className="flex flex-col">
        <div className=" text-9xl font-bold text-zinc-400">404</div>
        <div className=" text-4xl ">这里什么都没有</div>
        <Button>返回首页</Button>
      </div>
      <img className=" ml-[100px]" src={errimg + `?${Date.now()}`} />
    </div>
  )
}
