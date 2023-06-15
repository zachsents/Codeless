import { MAX_ROWS } from "./shared.js"


export default {
    id: "googlesheets:FindRows",

    inputs: ["$sheet", "filters", "$filterBehavior"],

    /**
     * @param {object} inputs
     * @param {import("google-spreadsheet").GoogleSpreadsheetWorksheet} inputs.$sheet
     * @param {{ column: string, compareFn: Function }[]} inputs.filters
     */
    async onInputsReady({ $sheet, filters, $filterBehavior }) {

        // Validate
        if (!$sheet) throw new Error("Must provide a Google Sheet")

        // Load rows
        const rows = await $sheet.getRows({
            limit: MAX_ROWS,
        })

        // Filter rows
        const filteredRows = rows.filter(row => {
            switch ($filterBehavior) {
                case "and":
                    return filters.every(filter => filter.compareFn(row[filter.column]))
                case "or":
                    return filters.some(filter => filter.compareFn(row[filter.column]))
            }
        })

        this.publish({ rows: filteredRows })
    }
}