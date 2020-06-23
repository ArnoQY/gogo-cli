module.exports = ({ file, options, env }) => ({
    plugins: [
        require('postcss-cssnext')({
            browsers: ['last 2 versions', '> 5%'],
            //保留自定义变量的写法，满足变量跨样式覆盖
            features: {
                customProperties: {
                    preserve: true,
                },
            },
        }),
        require('cssnano')({
            preset: [
                'default',
                {
                    discardComments: {
                        removeAll: true,
                    },
                },
            ],
        }),
    ],
})
