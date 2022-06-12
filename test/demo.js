const fs = require('fs')
const Path = require('path')
const { copySync } = require('../src/fs')

//fs.mkdirSync(path.resolve(__dirname, 'demo/a/b/c/d.js'), { recursive: true });

// const from = path.resolve(__dirname, 'demo2')
// const to = path.resolve(__dirname, 'demo')
// copySync(from, to, { existsIgnore: true })

const toPath = Path.resolve(__dirname, 'f/f/g/demo.txt')
copySync(Path.resolve(__dirname, 'demo2/01.txt'), toPath, { noOverlayFile: false })