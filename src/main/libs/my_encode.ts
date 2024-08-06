import fs from 'fs'
import path from 'path'
import { randomBytes, createHash, createCipheriv, createDecipheriv } from 'crypto'
import { PathHelper } from './path'
import { User } from '@common/entitys/user.entity'
import { ApiRespCode } from '@common/entitys/app.entity'
import { Log } from './log'
interface SecretyKeyInfo {
  key: string
  valid_data: string
  ver: string
}

export class MyEncode {
  private _pass_hash: Buffer | null = null
  private _encode_alg = 'aes-256-cbc'
  private secret_ver: string = '1.0'

  constructor() {}

  private getKeyPath(user: User) {
    return path.join(PathHelper.getHomeDir(), `secret_${user.id}.key`)
  }

  private getKeyPathByuserid(userid: number) {
    return path.join(PathHelper.getHomeDir(), `secret_${userid}.key`)
  }

  public HasLogin() {
    return this._pass_hash != null
  }

  public LoginOut() {
    this._pass_hash = null
  }

  public hasKey(userid: number) {
    const key_path = this.getKeyPathByuserid(userid)
    if (fs.existsSync(key_path)) {
      return true
    }
    return false
  }

  public Login(user: User, password: string): ApiRespCode {
    this._pass_hash = null
    const key_path = this.getKeyPath(user)
    if (fs.existsSync(key_path)) {
      const keyinfo_str = fs.readFileSync(key_path).toString()
      const keyinfo: SecretyKeyInfo = JSON.parse(keyinfo_str)
      if (keyinfo.ver != this.secret_ver) {
        return ApiRespCode.ver_not_match
      }
      const hash = this.getPassHash(keyinfo.key, password)
      try {
        const encode_data = this.Decode2(keyinfo.valid_data, hash)
        if (encode_data !== this.getUserValidStr(user)) {
          return ApiRespCode.password_err
        }
      } catch (e: any) {
        Log.Exception(e)
        return ApiRespCode.password_err
      }
      this._pass_hash = hash
      return ApiRespCode.SUCCESS
    }
    return ApiRespCode.key_not_found
  }

  public cleanKey(user: User) {
    let key_path = this.getKeyPath(user)
    if (fs.existsSync(key_path)) {
      fs.unlinkSync(key_path)
    }
  }

  public Register(user: User, password: string) {
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
    const key_path = this.getKeyPath(user)
    const hash = this.getPassHash(key, password)
    const valid_data = this.Encode2(this.getUserValidStr(user), hash)
    const keyinfo: SecretyKeyInfo = { key, valid_data, ver: this.secret_ver }
    fs.writeFileSync(key_path, JSON.stringify(keyinfo))
  }

  private getUserValidStr(user: User) {
    return JSON.stringify({ username: user.username, id: user.id })
  }

  public getPassHash(key: string, password: string) {
    return createHash('sha256').update(`${key}-${password}`).digest()
  }

  public getPassHashStr(key: string, password: string) {
    return createHash('sha256').update(`${key}-${password}`).digest('base64')
  }

  public Encode(data: string): string {
    return this.Encode2(data, this._pass_hash)
  }

  Encode2(data: string, key: Buffer): string {
    try {
      const iv = randomBytes(16)
      const cliper = createCipheriv(this._encode_alg, key, iv)
      let encrypted = cliper.update(data, 'utf8', 'base64url')
      encrypted += cliper.final('base64url')
      encrypted += '|' + iv.toString('base64url')
      return encrypted
    } catch (e: any) {
      Log.Exception(e)
    }
    return data
  }

  public Decode(data: string): string {
    return this.Decode2(data, this._pass_hash)
  }

  Decode2(data: string, key: Buffer): string {
    try {
      const [data_str, iv_str] = data.split('|')
      const iv = Buffer.from(iv_str, 'base64url')
      const decipher = createDecipheriv(this._encode_alg, key, iv)
      let decrypted = decipher.update(data_str, 'base64url', 'utf8')
      decrypted += decipher.final('utf8')
      return decrypted
    } catch (e: any) {
      Log.Exception(e, data)
    }
    return data
  }
}
