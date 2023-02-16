
const OverriddenFunctions = ["log", "debug", "warn", "info", "error"]


export const logger = new Proxy(console, {
    get(target, prop) {
        return OverriddenFunctions.includes(prop) && logger.prefix ?
            (...args) => Reflect.get(target, prop)(`[${logger.prefix}]`, ...args) :
            Reflect.get(target, prop)
    }
})

logger.setPrefix = newPrefix => logger.prefix = newPrefix
logger.reset = () => logger.setPrefix(null)