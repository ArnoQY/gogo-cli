import { appendScript, appendStyle } from './append'

export default (cssArr, jsArr) => {
    appendStyle(cssArr)
    appendScript(jsArr)
}
