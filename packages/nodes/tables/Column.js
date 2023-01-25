import { safeMap } from "../arrayUtilities.js"


export default {
    id: "tables:Column",
    name: "Column",

    inputs: ["table"],
    outputs: ["column"],

    onInputsReady({ table }) {

        const columnName = this.state.column
        
        this.publish({
            column: safeMap(tab => tab.getColumn(columnName), table)
        })
    },
}