const { del } = require('../src/fs')
const Path = require('path')

del(Path.resolve(__dirname, './aa.txt'))
//delExclude(Path.resolve(__dirname, 'aa'), ['01.txt', 'bb/cc'])