/*
 * @Author: shawcui
 * @LastEditTime: 2019-09-05 16:49:58
 */

const appendScript = (arr, cb, DOM) => {
    Promise.all(
        arr.map(
            item =>
                new Promise((resolve, reject) => {
                    let t = document.createElement('script')
                    t.type = 'text/javascript'
                    t.onload = () => resolve(t)
                    t.onerror = () => reject(item)
                    t.src = item
                    DOM ? DOM.appendChild(t) : document.body.appendChild(t)
                })
        )
    ).then(cb, (...item) => {
        throw new Error(`脚本加载错误！错误脚本包括${item.join(';\r\n')}`)
    })
}

const appendStyle = (arr, cb, DOM) => {
    Promise.all(
        arr.map(
            item =>
                new Promise((resolve, reject) => {
                    let t = document.createElement('link')
                    t.rel = 'stylesheet'
                    t.type = 'text/css'
                    t.onload = () => resolve(t)
                    t.onerror = () => reject(item)
                    t.src = item
                    DOM ? DOM.appendChild(t) : document.body.appendChild(t)
                })
        )
    ).then(cb, (...item) => {
        throw new Error(`样式加载错误！错误脚本包括${item.join(';\r\n')}`)
    })
}

export { appendScript, appendStyle }
