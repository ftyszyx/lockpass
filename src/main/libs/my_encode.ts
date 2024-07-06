import fs from 'fs'
import path from 'path'
import { InitKeyInfo } from '@common/entitys/app.entity'
import { randomBytes, createHash, createCipheriv, createDecipheriv } from 'crypto'
import DbHlper from './db_help'
import { User } from '@common/entitys/user.entity'
import AppModel from '@main/models/app.model'
import { PathHelper } from './path'
import { Log } from './log'
export class MyEncode {
  secret_key: string | null = null
  key_path = 'secret.key'
  encode_alg = 'aes-256-ccm'
  key_full_path = ''

  constructor() {
    this.key_full_path = path.join(PathHelper.getHomeDir(), this.key_path)
    Log.info('key_path:', this.key_full_path)
    if (fs.existsSync(this.key_full_path)) {
      this.secret_key = fs.readFileSync(this.key_full_path).toString()
    }
  }
  public needInitKey() {
    return this.secret_key === null
  }

  public async InitSystem(keyinfo: InitKeyInfo): Promise<boolean> {
    // prettier-ignore
    let key_data = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
    const rand_len = 25
    let randbytes = randomBytes(rand_len)
    let key = ''
    for (let i = 0; i < rand_len; i++) {
      key += key_data[randbytes[i] % key_data.length]
      if (i % 5 == 4 && i < rand_len - 1) {
        key += '-'
      }
    }
    let key_path = path.join(__dirname, 'secret.key')
    fs.writeFileSync(key_path, key)
    //生成hash
    let pass_hash = this.getPassHash(key, keyinfo.password)
    //存数据库
    const info = new User()
    info.username = keyinfo.username
    info.password = pass_hash
    info.set = ''
    const _this = this
    await DbHlper.instance()
      .AddOne(info)
      .then((res) => {
        _this.writeKey(key)
      })
      .catch((err) => {
        AppModel.getInstance().mainview?.showMsgErr(err.message)
      })
    return this.secret_key !== null
  }

  public getPassHash(key: string, password: string) {
    return createHash('sha256').update(`${key}-${password}`).digest('base64')
  }

  writeKey(key: string) {
    fs.writeFileSync(this.key_full_path, key)
    this.secret_key = key
  }

  public encode_data(data: string): string {
    const cliper = createCipheriv(this.encode_alg, Buffer.from(this.secret_key), randomBytes(16))
    let encrypted = cliper.update(data, 'utf8', 'base64')
    encrypted += cliper.final('base64')
    console.log('encode_data:', encrypted)
    return encrypted
  }

  public decode_data(data: string): string {
    const decipher = createDecipheriv(
      this.encode_alg,
      Buffer.from(this.secret_key),
      randomBytes(16)
    )
    let decrypted = decipher.update(data, 'base64', 'base64')
    decrypted += decipher.final('base64')
    console.log('decode_data:', decrypted)
    return decrypted
  }
}
