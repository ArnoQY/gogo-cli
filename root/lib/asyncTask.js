const series = (args, fn) => {
    let output = []
    const run = (i, resolve, reject) => {
        if (i === args.length) {
            resolve(output)
            typeof fn === 'function' && fn(output)
            return
        }
        return new Promise(args[i]).then(
            result => {
                output[i] = result
                run(i + 1, resolve, reject)
            },
            msg => reject(msg)
        )
    }
    return (resolve, reject) => run(0, resolve, reject)
}

const parallel = (args, fn, race = false) => {
    const promiseArr = args.map(item => () => new Promise(item).then(result => result, msg => msg))
    if (race)
        return (resolve, reject) =>
            Promise.race(promiseArr.map(item => item())).then(
                result => {
                    resolve(result)
                    typeof fn === 'function' && fn(result)
                },
                msg => reject(msg)
            )
    return (resolve, reject) =>
        Promise.all(promiseArr.map(item => item())).then(
            result => {
                resolve(result)
                typeof fn === 'function' && fn(result)
            },
            msg => reject(msg)
        )
}

const task = (arg, fn) => {
    return new Promise(arg).then(
        result => typeof fn === 'function' && fn(result),
        msg => {
            throw new Error(msg)
        }
    )
}

export { series, parallel, task }
