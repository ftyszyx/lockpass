import { Vault } from '@common/entitys/valuts.entity'

export class ValutService {
  constructor() {}

  public async getVaults(): Promise<Vault[]> {}

  public async addVault(vault: Vault): Promise<boolean> {
    return true
  }

  public async updateVault(vault: Vault): Promise<Vault> {
    return null
  }

  public async deleteVault(id: number): Promise<boolean> {
    return true
  }
}
