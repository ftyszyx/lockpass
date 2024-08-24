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

export function GetImportVaultName(type: string) {
  return `import_${type}`
}

export function str2csv(str: string) {
  if (str.indexOf(',') !== -1) return `"${str.replace(/"/g, '""')}"`
  return `${str.replace(/"/g, '""')}`
}

export function csv2str(csv: string) {
  if (csv.startsWith('"') && csv.endsWith('"')) {
    return csv.slice(1, csv.length - 1).replace(/""/g, '"')
  }
  return csv.replace(/""/g, '"')
}
