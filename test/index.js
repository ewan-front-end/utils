const fs = require('fs')
const path = require("path");
console.log(process.cwd());
// 读取文件信息
let lstatRes = fs.lstatSync(path.join(process.cwd(), 'src'))
console.log(lstatRes.isFile());