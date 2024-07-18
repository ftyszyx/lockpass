import { VaultItem } from '@common/entitys/valut_item.entity'

interface props {
  info: VaultItem
  onDel: () => void
}
export default function ValutItemInfo(props: props) {
  console.log('valutiteminfo render')
  return <div>valutiteminfo</div>
}
