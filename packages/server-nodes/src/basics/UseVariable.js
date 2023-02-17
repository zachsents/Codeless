
export default {
    id: "basic:UseVariable",
    name: "Use Variable",

    inputs: [],
    outputs: ["$"],

    onBeforeStart() {
        global.variables ??= {}
        global.variables[this.state.name] ??= new VariablePort()
        global.variables[this.state.name].subscribe(value => {
            this.publish({ $: value })
        })
    },
}

class VariablePort {

    subscribers = []

    subscribe(callback) {
        this.subscribers.push(callback)
    }

    publish(value) {
        this.subscribers.forEach(sub => sub(value))
    }
}