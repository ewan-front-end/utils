const { deleteDir } = require('../src/fs')
const Path = require('path')

deleteDir(Path.resolve(__dirname, './bb'))