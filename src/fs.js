const fs = require('fs')
const Path = require("path")

/** 主要版本 */
let major = process.version.match(/v([0-9]*).([0-9]*)/)[1]
/** 特性版本 */
let minor = process.version.match(/v([0-9]*).([0-9]*)/)[2]
// code 0成功 1
const returnMessage = (c, s, m, steps) => ({ code: c || 0, state: s || "success", message: m || "成功", steps: steps || [] })

function copyDirSync(from, to, options = {}) {
    const { existsIgnore, copyBeforeClean, overlayFile } = options
    if (fs.existsSync(to)) {
        if (existsIgnore) return returnMessage(1, 'ignore', '拷贝操作被忽略')
        if (copyBeforeClean) fs.rmSync(to, { recursive: true })
    }
    fs.mkdirSync(to, { recursive: true })
    let list = fs.readdirSync(from)
    for (const item of list) {
        let fromPath = Path.join(from, item), toPath = Path.join(to, item), statInfo = fs.lstatSync(fromPath)
        if (statInfo.isFile()) fs.copyFileSync(fromPath, toPath)
        if (statInfo.isDirectory()) copyDirSync(fromPath, toPath, options)
    }
}

const writeFile = async (absPath, content, success) => {
    typeof content !== "string" && (content = JSON.stringify(content, null, 4))
    fs.mkdirSync(Path.dirname(absPath), { recursive: true })
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
    mkdirSync(absPath) {
        fs.mkdirSync(absPath, { recursive: true })
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
    /**
     * @param {*} options 
     * options.existsIgnore       目标(文件、文件夹)存在则忽略拷贝动作
     * options.copyBeforeCleanDir 拷贝之前清空目标文件夹
     * options.noOverlayFile      不覆盖文件
     * @returns 
     */
    copySync(from, to, options = {}) {
        if (fs.existsSync(to) && options.existsIgnore) return
        const fromInfo = fs.lstatSync(from)
        if (fromInfo.isFile()) {
            fs.mkdirSync(Path.dirname(to), { recursive: true })
            if (fs.existsSync(to) && options.noOverlayFile) return
            fs.copyFileSync(from, to)
            return
        }
        if (Number(major) < 16 || Number(major) == 16 && Number(minor) < 7) {
            copyDirSync(from, to, options)
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



