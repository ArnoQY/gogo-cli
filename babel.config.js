module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
        '@babel/plugin-transform-runtime',
        'react-hot-loader/babel',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-function-bind'
    ]
}
