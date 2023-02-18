import { Range } from "./Range.js"


export class Sheet {

    /**
     * Creates an instance of Sheet.
     * @param {import("./Spreadsheet.js").Spreadsheet} spreadsheet
     * @param {string} name
     * @memberof Sheet
     */
    constructor(spreadsheet, name) {
        this.spreadsheet = spreadsheet
        this.name = name
    }

    get api() {
        return this.spreadsheet.api
    }

    range(...args) {
        if (args[0] instanceof Range) {
            args[0].sheet = this
            return args[0]
        }
        return new Range(this, ...args)
    }

    async asTable(options) {
        const details = await this.getDetails()
        return this.range(1, 1, details.gridProperties.rowCount, details.gridProperties.columnCount).asTable(options)
    }

    async getDetails() {
        const spreadsheetDetails = await this.spreadsheet.getDetails({ returnFullOutput: true })
        return spreadsheetDetails.sheets?.find(sheet => sheet.properties.title == this.name)?.properties
    }
}
