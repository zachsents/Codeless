import { airtable } from "@minus/server-sdk"


export default {
    id: "airtable:UseTable",
    name: "Use Table",

    inputs: [],
    outputs: ["table"],

    async onStart() {
        if(!this.state.baseId)
            throw new Error("Missing a Base ID")
        if(!this.state.tableId)
            throw new Error("Missing a Table ID")

        const at = await airtable.getAirTableAPI()
        const atTable = at.base(this.state.baseId).table(this.state.tableId)

        this.publish({
            // copy into our Table object that conforms to our standard Table API
            table: Object.assign(new airtable.Table(), atTable)
        })
    },
}