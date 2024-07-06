import { AppStore, use_appstore } from '@renderer/models/app.model'
import { useEffect } from 'react'

export default function Home() {
  console.log('home render')
  const appstore = use_appstore() as AppStore
  useEffect(() => {
    getAllData()
  }, [])
  async function getAllData() {
    await appstore.FetchAllValuts()
  }
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}
