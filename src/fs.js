const fs = require('fs')
const path = require("path")
/** 主要版本 */
let major = process.version.match(/v([0-9]*).([0-9]*)/)[1]
/** 特性版本 */
let minor = process.version.match(/v([0-9]*).([0-9]*)/)[2]
function copyDirSync(from, to) {
    // 如果存在文件夹 先递归删除该文件夹
    if (fs.existsSync(to)) fs.rmSync(to, { recursive: true })
    // 新建文件夹 递归新建
    fs.mkdirSync(to, { recursive: true });
    // 读取源文件夹
    let rd = fs.readdirSync(from)
    for (const fd of rd) {
        // 循环拼接源文件夹/文件全名称
        let fromFullName = from + "/" + fd;
        // 循环拼接目标文件夹/文件全名称
        let toFullName = to + "/" + fd;
        // 读取文件信息
        let lstatRes = fs.lstatSync(fromFullName)
        // 是否是文件
        if (lstatRes.isFile()) fs.copyFileSync(fromFullName, toFullName);
        // 是否是文件夹
        if (lstatRes.isDirectory()) copyDirSync(fromFullName, toFullName);
    }
}

// 递归创建目录 同步方法
function checkDirSync(dirname) {
    if (fs.existsSync(dirname)) {
        // console.log('目录已存在：' + dirname)
        return { message: "目录已存在", state: 1 }
    } else {
        if (checkDirSync(path.dirname(dirname))) {
            try {
                fs.mkdirSync(dirname)
                return { message: "目录已创建", state: 2 }
            } catch (err) {
                console.error(err)
            }
        }
    }
}

module.exports = {
    writeFileSync: (absPath, content, next) => {
        typeof content !== "string" && (content = JSON.stringify(content, null, 4))
        try {
            fs.writeFileSync(absPath, content)
            next && next()
        } catch (err) {
            console.error(err)
        }
    },
    writeFile: (absPath, content, success) => {
        typeof content !== "string" && (content = JSON.stringify(content, null, 4))
        fs.writeFile(absPath, content, { encoding: 'utf8' }, err => {
            if (err) {
                console.log(err)
            } else {
                success && success()
                !success && console.log('written: ' + absPath)
            }
        })
    },
    readFile: (path, ifNoCreateOne) => {
        if (fs.existsSync(path)) {
            return fs.readFileSync(path, 'utf8')
        } else if (ifNoCreateOne) {
            module.exports.writeFileSync(path, ``)
            return fs.readFileSync(path, 'utf8')
        }
        return null
    },
    editWritCommonFile: (path, editHandler) => {
        const fileObj = require(path)
        const next = editHandler(fileObj)
        next && module.exports.writeFile(path, `module.exports = ${JSON.stringify(fileObj, null, 4)}`)
    },
    mkdirSync(absPath, next) {
        let res = checkDirSync(absPath)
        next && next(res)
    },
    saveFile(filePath, fileData) {
        return new Promise((resolve, reject) => {
            /*fs.createWriteStream(path,[options])
            options <String> | <Object>
            {
                flags: 'w',
                defaultEncoding: 'utf8',
                fd: null,
                mode: 0o666,
                autoClose: true
            }
            */
            const wstream = fs.createWriteStream(filePath)
            wstream.on('open', () => {
                const blockSize = 128
                const nbBlocks = Math.ceil(fileData.length / (blockSize))
                for (let i = 0; i < nbBlocks; i += 1) {
                    const currentBlock = fileData.slice(blockSize * i, Math.min(blockSize * (i + 1), fileData.length),)
                    wstream.write(currentBlock)
                }
                wstream.end()
            })
            wstream.on('error', (err) => { reject(err) })
            wstream.on('finish', () => { resolve(true) })
        })
    },
    copyFileSync(from, to) {
        fs.copyFileSync(from, to)
    },
    copySync(from, to) {
        let lstat = fs.lstatSync(from)
        if (lstat.isFile()) {
            fs.copyFileSync(from, to)
            return
        }
        if (Number(major) < 16 || Number(major) == 16 && Number(minor) < 7) {
            copyDirSync(from, to)
        } else {
            fs.cpSync(from, to, { force: true, recursive: true })
        }
    },
    existsSync(path) {
        return fs.existsSync(path)
    }
}


