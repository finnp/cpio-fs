# cpio-fs

filesystem bindings for [cpio-stream](https://github.com/finnp/cpio-stream) based
on [tar-fs](https://github.com/mafintosh/tar-fs)

```
npm install cpio-fs
```

[![build status](https://secure.travis-ci.org/finnp/cpio-fs.png)](http://travis-ci.org/finnp/cpio-fs)

## Usage

cpio-fs allows you to pack directories into cpio archives and extract cpios into directories.


``` js
var cpio = require('cpio-fs')
var fs = require('fs')

// packing a directory
cpio.pack('./my-directory').pipe(fs.createWriteStream('my-cpio.cpio'))

// extracting a directory
fs.createReadStream('my-other-cpio.cpio').pipe(cpio.extract('./my-other-directory'))
```

To ignore various files when packing or extracting add a ignore function to the options. `ignore` is also an alias for `filter`.

``` js
var pack = cpio.pack('./my-directory', {
  ignore: function(name) {
    return path.extname(name) === '.bin' // ignore .bin files when packing
  }
})

var extract = cpio.extract('./my-other-directory', {
  ignore: function(name) {
    return path.extname(name) === '.bin' // ignore .bin files inside the cpio when extracing
  }
})
```

You can also specify which entries to pack using the `entries` option

```js
var pack = cpio.pack('./my-directory', {
  entries: ['file1', 'subdir/file2'] // only the specific entries will be packed
})
```

If you want to modify the headers when packing/extracting add a map function to the options

``` js
var pack = cpio.pack('./my-directory', {
  map: function(header) {
    header.name = 'prefixed/'+header.name
    return header
  }
})

var extract = cpio.extract('./my-directory', {
  map: function(header) {
    header.name = 'another-prefix/'+header.name
    return header
  }
})
```

Similarly you can use `mapStream` incase you wanna modify the input/output file streams

``` js
var pack = cpio.pack('./my-directory', {
  mapStream: function(fileStream, header) {
    if (path.extname(header.name) === '.js') {
      return fileStream.pipe(someTransform)
    }
    return fileStream;
  }
})

var extract = cpio.extract('./my-directory', {
  mapStream: function(fileStream, header) {
    if (path.extname(header.name) === '.js') {
      return fileStream.pipe(someTransform)
    }
    return fileStream;
  }
})
```

Set `options.fmode` and `options.dmode` to ensure that files/directories extracted have the corresponding modes

``` js
var extract = cpio.extract('./my-directory', {
  dmode: 0555, // all dirs and files should be readable
  fmode: 0444
})
```

It can be useful to use `dmode` and `fmode` if you are packing/unpacking cpios between *nix/windows to ensure that all files/directories unpacked are readable.

Set `options.strict` to `false` if you want to ignore errors due to unsupported entry types (like device files)

To dereference symlinks (pack the contents of the symlink instead of the link itself) set `options.dereference` to `true`.

## Copy a directory

Copying a directory with permissions and mtime intact is as simple as

``` js
cpio.pack('source-directory').pipe(cpio.extract('dest-directory'))
```

## License

MIT
