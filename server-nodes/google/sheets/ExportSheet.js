import "./shared.js"


export default {
    id: "googlesheets:ExportSheet",

    inputs: ["$sheet", "$format"],

    /**
     * @param {object} inputs
     * @param {import("google-spreadsheet").GoogleSpreadsheetWorksheet} inputs.$sheet
     * @param {string} inputs.$format
     */
    async onInputsReady({ $sheet, $format }) {

        // Validate
        if (!$sheet) throw new Error("Must provide a Google Sheet")

        // Create blob
        let blob
        switch ($format) {
            case "csv":
                blob = new Blob([await $sheet.downloadAsCSV()], { type: "text/csv" })
                break
            case "pdf":
                blob = new Blob([await $sheet.downloadAsPDF()], { type: "application/pdf" })
                break
            case "tsv":
                blob = new Blob([await $sheet.downloadAsTSV()], { type: "text/tab-separated-values" })
                break
        }

        this.publish({
            file: new File(`${$sheet.title}.${$format}`, blob)
        })
    },
}


class File {
    constructor(name, blob) {
        this.name = name
        this.blob = blob
    }

    toString() {
        return this.name
    }
}