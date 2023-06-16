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
        let file
        switch ($format) {
            case "csv":
                file = new File(`${$sheet.title}.csv`, "text/csv", await $sheet.downloadAsCSV())
                break
            case "pdf":
                file = new File(`${$sheet.title}.pdf`, "application/pdf", await $sheet.downloadAsPDF())
                break
            case "tsv":
                file = new File(`${$sheet.title}.tsv`, "text/tab-separated-values", await $sheet.downloadAsTSV())
                break
        }

        this.publish({ file })
    },
}


class File {
    constructor(name, contentType, data) {
        this.filename = name
        this.contentType = contentType
        this.data = data
    }

    toString() {
        return this.filename
    }
}