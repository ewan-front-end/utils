const { del } = require('../src/fs')
const Path = require('path')

del(Path.resolve(__dirname, './aa.txt'))