const fs = require('fs')
const path = require("path");


const {editWritCommonFile} = require('../src/fs')

editWritCommonFile(path.join(process.cwd(), 'package.json'), file => {
    file.version = '2.3.4'
    console.log(file);
})