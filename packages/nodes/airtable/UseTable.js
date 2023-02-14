import { airtable } from "@minus/server-sdk"


export default {
    id: "airtable:UseTable",
    name: "Use Table",

    inputs: [],
    outputs: ["table"],

    async onStart(setupPayload) {
        const at = await airtable.getAirTableAPI()
        this.publish({ table: "ok" })
    },
}