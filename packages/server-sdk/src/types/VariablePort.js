
export class VariablePort {

    /**
     * Sets up a VariablePort on the desired key in the global variables
     * object if one doesn't already exist. Returns the VariablePort.
     *
     * @static
     * @param {string} key
     * @return {VariablePort} 
     * @memberof VariablePort
     */
    static setupPortOnGlobals(key) {
        global.variables ??= {}
        global.variables[key] ??= new VariablePort()
        return global.variables[key]
    }

    static publish(key, value) {
        global.variables?.[key]?.publish(value)
    }

    subscribers = []

    subscribe(callback) {
        this.subscribers.push(callback)
    }

    subscribePromise() {
        return new Promise(resolve => {
            this.subscribers.push(resolve)
        })
    }

    publish(value) {
        this.subscribers.forEach(sub => sub(value))
    }
}