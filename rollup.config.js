const pkg = require('./package.json')

export default {
    input: 'src/main.js', 
    output: { 
        file: 'bundle.js', 
        format: 'cjs' 
    },
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.module, format: 'es' }
    ],

    external: ['lodash'],
    globals: {
        lodash: '_'
    }
}

