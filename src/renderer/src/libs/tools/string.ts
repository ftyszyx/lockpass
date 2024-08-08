export function getStrWidth(str: string): number {
  // 创建一个离屏的 canvas 元素
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  // 设置字体，确保与实际使用的字体一致
  context.font = '16px Arial'
  // 测量字符串的宽度
  const metrics = context.measureText(str)
  return metrics.width
}

export function getLabelStr(label: string, value: string = ''): string {
  value = (value || '').trim()
  if (value.length <= 0) return label
  const labelWidth = getStrWidth(label)
  const vaulewidth = getStrWidth(value)
  const targetWidth = 250 // 目标宽度，可以根据需要调整
  const padWidth = targetWidth - labelWidth - vaulewidth
  console.log('labelWidth', label, labelWidth, vaulewidth, padWidth)
  if (padWidth <= 0) return label + value
  // 计算填充字符的数量
  const padChar = ' '
  const padCount = Math.floor(padWidth / getStrWidth(padChar))
  //   console.log('labelWidth', padCount)
  const res = label + padChar.repeat(padCount) + value
  //   console.log('res', res)
  return res
}
