const crypto = require('crypto')

// 加密函数
function encrypt(text, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

// 解密函数
function decrypt(encryptedText, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// 示例用法
const key = crypto.randomBytes(32)
const plainText = '这是要加密的文本'
const encrypted = encrypt(plainText, key)
console.log('加密后的文本:', encrypted)

const decrypted = decrypt(encrypted, key)
console.log('解密后的文本:', decrypted)
