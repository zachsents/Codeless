
export { Table } from "./Table.js"


export class ExecutionSignal {

    constructor() {
        this.history = []
    }

    push(result) {
        this.history.push(result)
    }
}

export function shouldExecute(signal) {
    return signal instanceof ExecutionSignal
}