
export { Table } from "./Table.js"
export { Condition } from "./Condition.js"


export class ExecutionSignal {

}

export function shouldExecute(signal) {
    return signal instanceof ExecutionSignal
}