import { VaultItem } from '@common/entitys/valut_item.entity'
import { Vault } from '@common/entitys/vaults.entity'

export interface AppEntity {
  vaults: Vault[]
  vaut_items: VaultItem[]
}
