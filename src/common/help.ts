export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function FormatTime(time: Date) {
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}

export function getFileSize(size: number) {
  if (size < 1024) {
    return `${size}B`
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)}KB`
  }
  return `${(size / 1024 / 1024).toFixed(2)}MB`
}

export function SetFiledInfo(info: object, keys: string[], value: any) {
  let obj = info
  for (let i = 0; i < keys.length - 1; i++) {
    if (!obj[keys[i]]) obj[keys[i]] = {}
    obj = obj[keys[i]]
  }
  obj[keys[keys.length - 1]] = value
}

export function GetFiledInfo(info: object, keys: string[]) {
  let obj = info
  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i]]
    if (obj == null) return null
  }
  return obj
}

export function GetImportVaultName(type: string) {
  return `import_${type}`
}
