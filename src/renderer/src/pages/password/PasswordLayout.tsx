import { useEffect } from 'react'
import PasswordGenPanel from '../Vault/PasswordGenPanel'
import { FixWindowSize } from '@renderer/libs/tools/other'
import { renderViewType } from '@common/entitys/app.entity'

export default function PasswordLayout() {
  useEffect(() => {
    const timer = setInterval(() => {
      FixWindowSize(renderViewType.Password)
    }, 300)
    return () => {
      clearInterval(timer)
    }
  }, [])
  return (
    <div>
      <PasswordGenPanel show={true} onClose={() => {}} onOk={() => {}} />
    </div>
  )
}
