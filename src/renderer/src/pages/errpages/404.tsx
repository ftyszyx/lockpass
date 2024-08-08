import { Button, Result } from 'antd'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'

export default function NotFound() {
  const appset = use_appset() as AppsetStore
  return (
    <Result
      status="404"
      title={appset.getText('404.title')}
      subTitle={appset.getText('404.desc')}
      extra={<Button type="primary">{appset.getText('404.back')}</Button>}
    />
  )
}
