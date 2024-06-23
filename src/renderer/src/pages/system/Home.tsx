import { Button } from 'antd'

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Button
        type="primary"
        onClick={() => {
          window.electron.ipcRenderer.send('getuser_info')
        }}
      >
        get userinfo
      </Button>
    </div>
  )
}
