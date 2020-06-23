const reqCtx = require.context('images/icon', false, /\.svg$/)
const GOGO_ICON = reqCtx
    .keys()
    .map(reqCtx)
    .reduce((last, item) => {
        last[item.default.id.split('gogoIcon-')[1].split('-usage')[0]] =
            item.default
        return last
    }, {})

export default GOGO_ICON
