import { User } from '@common/entitys/user.entity'
import { VaultItem } from '@common/entitys/valut_item.entity'
import { Vault } from '@common/entitys/valuts.entity'
import { Table_Desc, Table_index_desc } from '@common/gloabl'
import duckdb from 'duckdb'
class DbHlper {
  private static _instance: DbHlper
  user: User
  vault: Vault
  vaultItem: VaultItem
  constructor() {
    this.user = new User()
    this.vault = new Vault()
    this.vaultItem = new VaultItem()
  }
  public db: duckdb.Database | null = null
  static instance() {
    if (!DbHlper._instance) {
      DbHlper._instance = new DbHlper()
      DbHlper._instance.db = new duckdb.Database('lockpass.db', {
        access_mode: 'READ_WRITE',
        max_memory: '512MB'
      })
    }
    return DbHlper._instance
  }

  public getconnection() {
    return this.db?.connect()
  }

  public initTables() {
    let conn = this.getconnection()
    const initFunc = (obj) => {
      const table_sql = Reflect.getMetadata(Table_Desc, obj)
      const index_sql = Reflect.getMetadata(Table_index_desc, obj)
      const sql_str = table_sql + index_sql
      conn.each(sql_str, (err, row) => {
        if (err) {
          console.log(err)
        }
      })
    }
    if (conn) {
      initFunc(this.user)
      initFunc(this.vault)
      initFunc(this.vault)
    }
  }
}
export default DbHlper
