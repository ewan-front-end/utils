const { delDest, delDirExc } = require('../src/fs')
const Path = require('path')

//delDest(Path.resolve(__dirname, './aa.txt'))
delDirExc(Path.resolve(__dirname, 'aa'), ['01.txt', 'bb/cc/0001.js'])