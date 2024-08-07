// import { Segmenter } from 'intl-segmenter'
const { Segmenter } = require('intl-segmenter')

str1 = '打开lockpass'
str2 = '锁定'
str3 = '打开快速访问'
right1 = 'Shift+CommandOrControl+b'
right2 = 'CommandOrControl+ Shift+up'
right3 = 'CommandOrControl+ Shift+l'
// const segmenter = new Intl.Segmenter()
const segementer = new Segmenter()
function getstr(text1, txt2) {
  const length = 0
  for (const _ of segemter.segment(text1)) {
    // eslint-disable-line no-unused-vars
    length++
  }
  console.log(text1, length)
  return text1.padEnd(20, 'A') + txt2
}

console.log(getstr(str1, right1))
console.log(getstr(str2, right2))
console.log(getstr(str3, right3))
