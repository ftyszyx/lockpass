const src_words = require('./words_dictionary.json')
const fs = require('fs')
let outputjson = {}
outputjson.items = []
Object.keys(src_words).forEach((key) => {
  if (key.length >= 3) {
    // const len_key = `len_${key.length}`
    // if (!outputjson[len_key]) {
    //   outputjson[len_key] = []
    // }
    outputjson.items.push(key)
  }
})

fs.writeFileSync('../src/common/words_password.json', JSON.stringify(outputjson, null, 2))
