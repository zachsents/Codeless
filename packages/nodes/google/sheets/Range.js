import { sheets } from "@minus/server-sdk"


export default {
    id: "googlesheets:Range",
    name: "Range",

    inputs: ["$sheet"],
    outputs: ["data"],

    /**
     * @param {object} inputs
     * @param {sheets.Sheet} inputs.$sheet
     */
    async onInputsReady({ $sheet }) {
        
        // create range and get data
        const data = await $sheet.range(...this.state.range).getData()

        // return the values straight up if it's 1D or a single value
        if (data.length == 1) {
            if (data[0].length == 1) {
                this.publish({ data: data[0][0] })
                return
            }
            this.publish({ data: data[0] })
            return
        }

        // otherwise, return straight up
        this.publish({ data })
    },
}