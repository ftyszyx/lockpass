import { VaultItem } from '@common/entitys/vault_item.entity'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Input } from 'antd'
import { useEffect, useState } from 'react'

export default function QuickSearch() {
  const appset = use_appset() as AppsetStore
  const [search, setSearch] = useState('')
  const [showitems, setShowitems] = useState<VaultItem[]>([])
  useEffect(() => {}, [])
  return (
    <div className="p-4">
      <Input
        value={search}
        onChange={(event: any) => {
          setSearch(event.target.value)
        }}
        placeholder={appset.lang.getText('quicksearch.input.placeholder')}
      ></Input>
      <div className="flex flex-col">
        {showitems.map((item) => {
          return (
            <div key={item.id} className="flex flex-row items-center space-x-2">
              <div className="flex-grow">{item.name}</div>
              {/* <div>{item.info?.username}</div> */}
            </div>
          )
        })}
      </div>
    </div>
  )
}
