import { safeMap } from "../arrayUtilities.js"


export default {
    id: "tables:Column",
    name: "Column",

    inputs: ["table"],
    outputs: ["column"],

    onInputsReady({ table }) {

        const res = safeMap(row => row.getColumn(this.state.column), table)
        
        this.publish({
            column: res
        })
    },
}