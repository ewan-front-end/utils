const inquirer = require('inquirer')

function prompt(type, title, options) {
    return new Promise(resolve => {
        Object.assign(options, {
            name: 'value',
            type,
            message: title
        })
        inquirer.prompt([options]).then((res) => {
            resolve(res.value)
        })
    })
}

// const {input, checkbox, radio, confirm, password} = require('inquirer-prompt.js')
module.exports = {
    /**
     * 复选框
     * @param {String} title 
     * @param {Array} options 选项集合
     * @param {Array} defaultValue 子选项集合
     * @return {Array} ['复选一']
     * @example
     *  checkbox('请勾选下列选项:', ['复选一', '复选二', '复选三']).then(arr => {
            console.log('复选结果', typeof arr, arr)
        })
     */
    checkbox: (title, options, defaultValue) => {
        title = title || 'Please multiple choice:'
        defaultValue = defaultValue || []
        return prompt('checkbox', title, {
            choices: options,
            default: defaultValue
        })
    },
    /**
     * 单选框
     * @param {String} title 
     * @param {Array[Object]} options 
     * @param {Number} defaultValue 数组索引
     * @return {值类型} 2/‘2’
     * @example
     *  radio('请选择下列选项:', [{ value: 1, name: '单选一' }, { value: 2, name: '单选二' }]).then(value => {
            console.log('单选结果', typeof value, value)
        })
     */
    radio: (title, options, defaultValue) => {
        title = title || 'Please single choice:'
        return prompt('list', title, {
            choices: options,
            default: defaultValue || 0
        })
    },
    /**
     * 输入密码
     * @param {String} title 
     * @param {Boolean} showMask 是否显示*号
     * @returns {String} '123456'
     * @example
     *  password('请输入密码:', true).then(str => {
            console.log('输入密码', typeof str, str)
        })
     */
    password: (title, showMask) => {
        title = title || 'Please enter password:'
        return prompt('password', title, { mask: !!showMask })
    },
    /**
     * 确认
     * @param {String} title 
     * @param {Boolean} defaultValue
     * @returns {Boolean} false
     * @example
     *  confirm('请确认！', true).then(bl => {
            console.log('确认结果', typeof bl, bl)
        })
     */
    confirm: (title, defaultValue) => {
        title = title || 'Please confirm!'
        return prompt('confirm', title, { default: !!defaultValue })
    },
    /**
     * 输入
     * @param {String} title 
     * @param {String/Number} defaultValue
     * @returns {value} 输入的都识别为String 默认值为Number时返回Number
     * @example
     *  input('请输入:', '默认值').then(value => {
            console.log('输入结果', typeof value, value)
        })
     */
    input: (title, defaultValue) => {
        title = title || 'Please input:'
        return prompt('input', title, { default: defaultValue || '' })
    }
}
