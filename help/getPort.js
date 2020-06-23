/*
 * 返回距离最近的可用端口
 */

import { spawnSync } from 'child_process'

const getPort = base => {
    const lsof = spawnSync('lsof', [`-i:${base}`], { shell: true })
    return lsof.status ? base : getPort(++base)
}

export default getPort
