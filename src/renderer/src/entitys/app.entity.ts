import { VaultItem } from '@common/entitys/valut_item.entity'
import { Vault } from '@common/entitys/valuts.entity'

export interface AppEntity {
  fold_menu: boolean
  vaults: Vault[]
  vaut_items: VaultItem[]
  toggleFoldMenu: () => void
  // valuts
  FetchAllValuts: () => void
  UpdateValut: (valut: Vault) => void
  DeleteValut: (valut: Vault) => void
  AddValut: (valut: Vault) => void
  //valut_item
  FetchValutItems: () => void
  UpdateValutItem: (info: VaultItem) => void
  DeleteValutItem: (info: VaultItem) => void
  AddValutItem: (info: VaultItem) => void
  //search
  SearchValutItems: (keyword: string, vault_id: Number) => VaultItem[]
}
