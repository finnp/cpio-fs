var tarfs = require('tar-fs')
var cpio = require('cpio-stream')

exports.pack = function (cwd, opts) {
  opts = opts || {}
  opts.pack = cpio.pack({format: opts.format || 'odc'})
  return tarfs.pack(cwd, opts)
}

exports.extract = function (cwd, opts) {
  opts = opts || {}
  opts.extract = cpio.extract()
  return tarfs.extract(cwd, opts)
}
