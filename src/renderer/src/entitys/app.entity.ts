import { VaultItem } from '@common/entitys/valut_item.entity'
import { Vault } from '@common/entitys/valuts.entity'

export interface AppEntity {
  vaults: Vault[]
  vaut_items: VaultItem[]
}
