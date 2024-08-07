const crypto = require('crypto')
const arg = 'aes-256-cbc'
function Encode2(data, key) {
  const iv = crypto.randomBytes(16)
  const cliper = crypto.createCipheriv(arg, key, iv)
  let encrypted = cliper.update(data, 'utf8', 'base64url')
  encrypted += cliper.final('base64url')
  let text = encrypted + '|' + iv.toString('base64url')
  return text
}

function Decode2(data, key) {
  const [data_str, iv_str] = data.split('|')
  const iv = Buffer.from(iv_str, 'base64url')
  const decipher = crypto.createDecipheriv(arg, key, iv)
  let decrypted = decipher.update(data_str, 'base64url', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

const key = crypto.createHash('sha256').update('1234567890123456').digest() //.digest('base64').substring(0, 32)
const src_test = '耗损在需要'
const res = Encode2(src_test, key)
console.log('加密后的文本:', res)
const res2 = Decode2(res, key)
console.log('解密后的文本:', res2)
