import { Sentinel } from "./Sentinel.js"


export class TableField extends Sentinel {
    constructor(field) {
        super()
        this.field = field
    }

    toString() {
        return `Table Field "${this.field}"`
    }
}
