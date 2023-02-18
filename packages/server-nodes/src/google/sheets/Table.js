

export default {
    id: "googlesheets:Table",
    name: "Table",

    inputs: ["$sheet"],
    outputs: ["table"],

    /**
     * @param {object} inputs
     * @param {import("@minus/server-sdk").sheets.Sheet} inputs.$sheet
     */
    async onInputsReady({ $sheet }) {

        const tableOptions = {
            headerRow: this.state.headerRow,
            dataStartRow: this.state.startRow,
        }

        const table = this.state.useEntireSheet ?
            await $sheet.asTable(tableOptions) :
            await $sheet.range(...this.state.range).asTable(tableOptions)

        this.publish({ table })
    },
}