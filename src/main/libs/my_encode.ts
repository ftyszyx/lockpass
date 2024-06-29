import fs from 'fs'
import path from 'path'
import { InitKeyInfo } from '@common/entitys/app.entity'
import { randomBytes, createHash } from 'crypto'
import DbHlper from './db_help'
import { User } from '@common/entitys/user.entity'
export class MyEncode {
  secret_key: string | null = null
  constructor() {
    let key_path = path.join(__dirname, 'secret.key')
    if (fs.existsSync(key_path)) {
      this.secret_key = fs.readFileSync(key_path).toString()
    }
  }
  public needInitKey() {
    return this.secret_key === null
  }

  public InitKey(keyinfo: InitKeyInfo) {
    // prettier-ignore
    let key_data = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
    let randbytes = randomBytes(25)
    let key = ''
    for (let i = 0; i < 25; i++) {
      key += key_data[randbytes[i] % key_data.length]
      if (i % 5 == 4) {
        key += '-'
      }
    }
    let key_path = path.join(__dirname, 'secret.key')
    fs.writeFileSync(key_path, key)
    this.secret_key = key
    //生成hash
    let pass_hash = this.getPassHash(keyinfo.password)
    //存数据库
    const info = new User()
    info.username = keyinfo.username
    info.password = pass_hash
    info.set = ''
    DbHlper.instance().AddOne(info)
  }

  public getPassHash(password: string) {
    return createHash('sha256').update(`${this.secret_key}-${password}`).digest('base64')
  }
}
