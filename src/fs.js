const fs = require('fs')
const mkdirp = require('mkdirp')
const Path = require("path")

/** 主要版本 */
let major = process.version.match(/v([0-9]*).([0-9]*)/)[1]
/** 特性版本 */
let minor = process.version.match(/v([0-9]*).([0-9]*)/)[2]

// 递归创建目录 同步方法
function checkDirSync(dirname) {
    if (fs.existsSync(dirname)) {
        // console.log('目录已存在：' + dirname)
        return { message: "目录已存在", state: 1 }
    } else {
        if (checkDirSync(Path.dirname(dirname))) {
            try {
                fs.mkdirSync(dirname)
                return { message: "目录已创建", state: 2 }
            } catch (err) {
                console.error(err)
            }
        }
    }
}

function copyDirSync(from, to, clear) {
    // 如果存在文件夹 先递归删除该文件夹
    if (fs.existsSync(to) && clear) fs.rmSync(to, { recursive: true })
    checkDirSync(Path.dirname(to))
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
        if (lstatRes.isDirectory()) copyDirSync(fromFullName, toFullName, clear);
    }
}

const writeFile = async (absPath, content, success) => {
    typeof content !== "string" && (content = JSON.stringify(content, null, 4))
    checkDirSync(Path.dirname(absPath))
    fs.writeFile(absPath, content, { encoding: 'utf8' }, err => {
        if (err) {
            console.log('UTILS.fs.writeFile', err)
        } else {
            success && success(absPath)
            !success && console.log('written: ' + absPath)
        }
    })
}

function deleteDir(dest, exc, keepDir) {
    if (fs.existsSync(dest) && !exc.includes(dest)) {
        let files = fs.readdirSync(dest)
        files.forEach((file, index) => {
            const curPath = Path.join(dest, file)
            if (fs.statSync(curPath).isDirectory()) {
                deleteDir(curPath, exc)
            } else {
                !exc.includes(curPath) && fs.unlinkSync(curPath)
            }
        })
        if (!keepDir) {
            try {
                fs.rmdirSync(dest)
            } catch (err) { }
        }
    }
}

module.exports = {
    /**
     * 删除目标(文件/文件夹)
     * @param {string} dest 目标目录
     */
    delDest: (dest, exc) => {
        if (fs.existsSync(dest)) {
            if (fs.statSync(dest).isDirectory()) {
                deleteDir(dest, [])
            } else {
                fs.unlinkSync(dest)
            }
        }
    },
    /**
     * 删除目录
     * @param {string} dir 目标目录
     * @param {array} exc 排除项目(文件/文件夹)
     */
    delDirExc: (dir, exc) => {
        exc.map((e, i) => {
            exc[i] = Path.join(dir, e)
        })
        deleteDir(dir, exc, true)
    },
    writeFileSync: (absPath, content, next) => {
        typeof content !== "string" && (content = JSON.stringify(content, null, 4))
        try {
            fs.writeFileSync(absPath, content)
            next && next()
        } catch (err) {
            console.error(err)
        }
    },
    writeFile,
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
        next && writeFile(path, `module.exports = ${JSON.stringify(fileObj, null, 4)}`)
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
    copySync(from, to, clear) {
        let lstat = fs.lstatSync(from)
        if (lstat.isFile()) {
            checkDirSync(Path.dirname(to))
            fs.copyFileSync(from, to)
            return
        }
        if (Number(major) < 16 || Number(major) == 16 && Number(minor) < 7) {
            copyDirSync(from, to, clear)
        } else {
            fs.cpSync(from, to, { force: true, recursive: true })
        }
    },
    editJson: (path, editHandler, success) => {
        const fileObj = require(path)
        editHandler(fileObj)
        writeFile(path, JSON.stringify(fileObj, null, 4), success)
    },
    existsSync(path) {
        return fs.existsSync(path)
    }
}



