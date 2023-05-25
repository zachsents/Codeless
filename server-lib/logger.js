
const OverriddenFunctions = ["log", "debug", "warn", "info", "error"]


export const logger = new Proxy(console, {
    get(target, prop) {
        return OverriddenFunctions.includes(prop) && logger.prefixStack?.length ?
            (...args) => Reflect.get(target, prop)(`[${logger.prefixStack[0]}]`, ...args) :
            Reflect.get(target, prop)
    }
})

logger.prefixStack = []
logger.setPrefix = newPrefix => logger.prefixStack.unshift(newPrefix)
logger.done = () => logger.prefixStack.shift()