const fs = require('fs')
const zlib = require('zlib')
const pipeline = require('stream').pipeline

function do_gzip(src_path, dest_path) {
  const gzip = zlib.createGzip()
  const src = fs.createReadStream(src_path)
  const dest = fs.createWriteStream(dest_path)
  src.pipe(gzip).pipe(dest)
  dest.on('finish', () => {
    console.log('File successfully compressed')
  })
  dest.on('error', (err) => {
    console.error('An error occurred:', err)
    process.exitCode = 1
  })
}

do_gzip('back', 'back.gz')
