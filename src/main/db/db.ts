import duckdb from 'duckdb'
class DbHlper {
  private static _instance: DbHlper
  constructor() {}
  public db: duckdb.Database | null = null
  static instance() {
    if (!DbHlper._instance) {
      DbHlper._instance = new DbHlper()
      DbHlper._instance.db = new duckdb.Database('bugly.db', {
        access_mode: 'READ_WRITE',
        max_memory: '512MB'
      })
    }
    return DbHlper._instance
  }

  public getconnection() {
    return this.db?.connect()
  }
}
export default DbHlper
