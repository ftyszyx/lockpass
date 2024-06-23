export function kl_isNull(value: any, message?: string) {
  if (value === false || value === null || typeof value === 'undefined') {
    throw new Error(message)
  }
}
